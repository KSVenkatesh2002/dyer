import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { jsonResponse, errorResponse } from '@/lib/response';
import Employee from '@/models/employee.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

//show employee list with mark attendance option on same screen : markAttendancePage
export async function GET() {
    try {
        await dbConnect();

        const { userId } = await auth(); // Clerk authenticated user ID
        if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const employees = await Employee.aggregate([
            {
                $match: {
                    job: { $in: ['tying', 'dyeing'] },
                    createdBy: { $eq: userId }, // ✅ moved out of $lookup
                }
            },
            {
                $lookup: {
                    from: 'attendances',
                    let: { empId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$createdBy', userId] },
                                        { $eq: ['$employeeId', '$$empId'] },
                                        { $gte: ['$date', today] },
                                        { $lt: ['$date', tomorrow] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'todayAttendance'
                }
            },
            {
                $addFields: {
                    todayAttendance: { $arrayElemAt: ['$todayAttendance', 0] },
                    attendanceStatus: { $ifNull: [{ $arrayElemAt: ['$todayAttendance.status', 0] }, null] },
                    paid: { $ifNull: [{ $arrayElemAt: ['$todayAttendance.paid', 0] }, null] }
                },
                // $addFields: {
                //     attendanceStatus: { $ifNull: ['$todayAttendance.status', null] },
                //     paid: { $ifNull: ['$todayAttendance.paid', null] }
                // }
            },
            {
                $lookup: {
                    from: 'employeesummaries',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'summary'
                }
            },
            {
                $addFields: {
                    summary: { $arrayElemAt: ['$summary', 0] }
                }
            },
            {
                $addFields: {
                    unpaidFullDays: '$summary.unpaidFullDays',
                    unpaidHalfDays: '$summary.unpaidHalfDays',
                    totalUnpaidAmount: '$summary.totalUnpaidAmount',
                    unpaidPartialAmount: '$summary.unpaidPartialAmount',
                }
            },
            {
                $project: {
                    name: 1,
                    job: 1,
                    salaryPerDay: 1,
                    attendanceStatus: 1,
                    paid: 1,
                    unpaidFullDays: 1,
                    unpaidHalfDays: 1,
                    totalUnpaidAmount: 1,
                    todayAttendance:1
                }
            }
        ]);

        return NextResponse.json(employees, { status: 200 });
    } catch (error) {
        console.error('[EMPLOYEE_LIST_ERROR]', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
`_id: new ObjectId('6849cdc95cc288eeadfdf5a7'),
    name: 'tyu1',
    job: 'tying',
    salaryPerDay: 400,
    attendanceStatus: null,
    paid: null,
    unpaidFullDays: 0,
    unpaidHalfDays: 0,
    totalUnpaidAmount: 0,
    unpaidPartialAmount: 0`