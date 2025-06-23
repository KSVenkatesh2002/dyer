import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/employee.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

// add employee
export async function POST(req) {
    await dbConnect();

    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, {status: 401});

        const body = await req.json();
        const {
            name,
            phone,
            joinDate,
            address,
            job,
            salaryPerDay,
            workExperience,
            previousWorkPlace,
        } = body;

        const nameExists = await Employee.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            createdBy: userId,
        });
        if (nameExists) return NextResponse.json({ error: 'Name already exists' }, {status: 401});

        if (!phone || phone.length < 10) {
            return NextResponse.json({ error: 'Please provide a valid phone number' }, {status: 401});
        }

        const phoneExist = await Employee.findOne({ phone, createdBy: userId });
        if (phoneExist) return NextResponse.json({ error: 'Phone already exists' }, {status: 401});

        if (!['tying', 'dyeing', 'asu-marking', 'asu-winding'].includes(job)) {
            return NextResponse.json({ error: 'Invalid job type' }, {status: 401});
        }
        if (!joinDate || isNaN(Date.parse(joinDate))) {
            return NextResponse.json({ error: 'Invalid join date' }, {status: 401});
        }


        const newEmployee = new Employee({
            name: name?.trim(),
            phone: phone?.trim(),
            joinDate,
            address: address?.trim(),
            job,
            createdBy: userId, // ⬅️ added user ownership
            salaryPerDay: ['tying', 'dyeing'].includes(job) ? salaryPerDay : undefined,
            workExperience: workExperience || '',
            previousWorkPlace: previousWorkPlace || '',
        });

        const savedEmployee = await newEmployee.save();

        let newEmployeeSummaryField;

        if (['tying', 'dyeing'].includes(job)) {
            newEmployeeSummaryField = {
                employeeId: savedEmployee._id,

                totalFullDays: 0,
                totalHalfDays: 0,
                totalAbsentDays: 0,

                unpaidFullDays: 0,
                unpaidHalfDays: 0,
                unpaidPartialAmount: 0,

                totalPaidAmount: 0,
                totalUnpaidAmount: 0,
                advancePay: 0,

                createdBy: userId,

                lastPaidDay: new Date(joinDate),

            }
        } else if (['asu-marking', 'asu-winding'].includes(job)) {
            newEmployeeSummaryField = {
                employeeId: savedEmployee._id,

                totalPaidAmount: 0,
                totalUnpaidAmount: 0,
                advancePay: 0,

                createdBy: userId,
            }
        }
        const employeeSummary = new EmployeeSummary(newEmployeeSummaryField);

        await employeeSummary.save();

        return NextResponse.json({ success: true }, {status: 201});
    } catch (error) {
        console.error('[ADD_EMPLOYEE_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, {status: 500});
    }
}