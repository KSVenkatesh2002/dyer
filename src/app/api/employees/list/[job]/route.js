import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { jsonResponse, errorResponse } from '@/lib/response';
import Employee from '@/models/employee.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

// return employees list based on job
export async function GET(req, {params}) {
    try {
        await dbConnect();

        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
        const { job } = await params;
        const employees = await Employee.aggregate([
            {
                $match: {
                    job: { $eq: job },
                    createdBy: { $eq: userId },
                }
            },
            {
                $project: {
                    name: 1
                }
            }
        ]);

        return NextResponse.json(employees, { status: 200 });
    } catch (error) {
        console.error('[EMPLOYEE_LIST_ERROR]', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}