// app/api/attendance/[employeeId]/route.js
import dbConnect from '@/lib/dbConnect';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import Employee from '@/models/employee.model';
import Attendance from '@/models/attendance.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import PaymentRecord from '@/models/paymentRecord.model';
import { NextResponse } from 'next/server';
//attendanceDashboardDetailsFetch
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { userId } = await auth();
        const { employeeId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        const employee = await Employee.findOne({ _id: employeeId, createdBy: userId }).lean();
        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        if (!['tying', 'dyeing'].includes(employee.job)) {
            return NextResponse.json({ error: 'This employee job is not time-based' }, { status: 400 });
        }

        const summary = await EmployeeSummary.findOne({ employeeId, createdBy: userId });

        const attendanceRecords = await Attendance.find({ employeeId, createdBy: userId })
            .select('date status paid partialPay -_id')
            .sort({ date: 1 })
            .lean();

        const formattedRecords = attendanceRecords.map(record => ({
            date: record.date.toISOString().split('T')[0],
            status: record.status,
            paid: record.paid
        }));

        return NextResponse.json({
            employee: {
                employeeId: employee._id,
                name: employee.name,
                phone: employee.phone,
                joinDate: employee.joinDate,
                salaryPerDay: employee.salaryPerDay,
                job: employee.job,
            },
            totalUnpaidAmount: summary?.totalUnpaidAmount || 0,
            totalFullDays: summary?.totalFullDays || 0,
            totalHalfDays: summary?.totalHalfDays || 0,
            totalAbsentDays: summary?.totalAbsentDays || 0,
            unpaidFullDays: summary?.unpaidFullDays || 0,
            unpaidHalfDays: summary?.unpaidHalfDays || 0,
            unpaidPartialAmount: summary?.unpaidPartialAmount || 0,
            totalPaidAmount: summary?.totalPaidAmount || 0,
            advancePay: summary?.advancePay || 0,
            lastPaidDay: summary?.lastPaidDay || null,
            attendanceRecords: formattedRecords
        }, { status: 200 });

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