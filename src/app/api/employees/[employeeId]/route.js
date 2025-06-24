
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/employee.model';
import { auth } from '@clerk/nextjs/server';

// get employee
export async function GET(req, { params }) {
    await dbConnect();

    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { employeeId } = await params;

        // employee details - get and validate
        const employeeDetails = await Employee.findOne({ _id: employeeId, createdBy: userId }).lean();
        if (!employeeDetails) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({
            employeeId: employeeDetails._id,
            name: employeeDetails.name,
            phone: employeeDetails.phone,
            joinDate: employeeDetails.joinDate,
            salaryPerDay: employeeDetails.salaryPerDay,
            job: employeeDetails.job,
        }, { status: 200 });
    } catch (error) {
        console.error('[ADD_EMPLOYEE_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}