// app/api/attendance/[employeeId]/route.js
import dbConnect from '@/lib/dbConnect';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import Employee from '@/models/employee.model';
import Attendance from '@/models/attendance.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import PaymentRecord from '@/models/paymentRecord.model';
import { NextResponse } from 'next/server';

// get attendance records
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { employeeId } = await params;
        const url = new URL(req.url);
        const month = parseInt(url.searchParams.get('month')); // 1–12
        const year = parseInt(url.searchParams.get('year'));

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        const query = { employeeId, createdBy: userId };

        if (!isNaN(month) && !isNaN(year)) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59); // end of month
            query.date = { $gte: start, $lte: end };
        }

        const attendanceRecords = await Attendance.find(query)
            .select('date status paid partialPay -_id')
            .sort({ date: 1 })
            .lean();

        const formattedRecords = attendanceRecords.map(record => ({
            date: record.date.toISOString().split('T')[0],
            status: record.status,
            paid: record.paid,
        }));

        return NextResponse.json(formattedRecords, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

//clearAttendanceHistory
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { userId } = await auth();
        const { employeeId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        // Delete all attendance records
        await Attendance.deleteMany({ employeeId, createdBy: userId });

        // Reset summary values
        await EmployeeSummary.findOneAndUpdate(
            { employeeId, createdBy: userId },
            {
                totalFullDays: 0,
                totalHalfDays: 0,
                totalAbsentDays: 0,
                unpaidFullDays: 0,
                unpaidHalfDays: 0,
                unpaidPartialAmount: 0,
                totalUnpaidAmount: 0,
                totalPaidAmount: 0,
                advancePay: 0,
                lastPaidDay: employee.joinDate,
            },
            { new: true }
        );

        // Delete all payment records
        await PaymentRecord.deleteMany({ employeeId, createdBy: userId });

        return NextResponse.json({
            success: true,
            message: 'Attendance history cleared successfully.'
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}