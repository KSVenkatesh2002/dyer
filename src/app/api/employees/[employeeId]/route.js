
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/employee.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

// add employee
export async function GET(req, { params }) {
    await dbConnect();

    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, {status: 401});

        const { employeeId } = await params;
        // console.log(employeeId);
        

        const employeeDetails = await Employee.findOne({ _id: employeeId, createdBy: userId })
        // console.log(employeeDetails);
        

        return NextResponse.json(employeeDetails, {status: 200});
    } catch (error) {
        console.error('[ADD_EMPLOYEE_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, {status: 500});
    }
}