// app/api/employees/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/employee.model';
import Attendance from '@/models/attendance.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import PaymentRecord from '@/models/paymentRecord.model';
import { jsonResponse } from '@/lib/response';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';


// editEmployee
export async function PUT(req, {params}) {
    await dbConnect();
    try {
        const { employeeId } = await params;
        console.log('employeeId: ',employeeId);

        const { userId } = await auth();
        if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);

        const { name, phone, salaryPerDay } = await req.json();

        if (!employeeId) return jsonResponse({ error: 'Please provide employeeId' }, 400);
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid ID EmployeeId' }, { status: 400 });
        }
        if (!name) return jsonResponse({ error: 'Please provide username' }, 400);
        if (!phone) return jsonResponse({ error: 'Please provide phone' }, 400);
        if (salaryPerDay <= 0) return jsonResponse({ error: 'Please provide valid salary' }, 400);

        const employee = await Employee.findOne({ _id: employeeId, createdBy: userId });
        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        employee.name = name;
        employee.phone = phone;
        employee.salaryPerDay = salaryPerDay;

        const updated = await employee.save();

        return jsonResponse({
            success: true,
            employee: {
                name: updated.name,
                phone: updated.phone,
                salaryPerDay: updated.salaryPerDay,
            }
        }, 200);
    } catch (error) {
        console.error('PUT /editEmployee error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
    }
}
// deleteEmployee
export async function DELETE(req, { params }) {
    await dbConnect();
    try {

        const { userId } = await auth();
        if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);

        const { employeeId } = await params;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const exists = await Employee.findOne({ _id: employeeId, createdBy: userId });
        if (!exists) throw new Error('Employee not found');

        await Attendance.deleteMany({ employeeId, createdBy: userId });
        await EmployeeSummary.deleteOne({ employeeId, createdBy: userId  });
        await PaymentRecord.deleteMany({ employeeId, createdBy: userId  });
        await Employee.deleteOne({ employeeId, createdBy: userId  });

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}