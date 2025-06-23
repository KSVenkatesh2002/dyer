// src/app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/employee.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import Attendance from '@/models/attendance.model';
import PaymentRecord from '@/models/paymentRecord.model';
import { validatePaymentInput } from '@/lib/payments/validate';
import { handleTimeBasedPayment } from '@/lib/payments/timeBasedPayments';
import { handleTaskBasedPayment } from '@/lib/payments/taskBasedPayments';
import { auth } from '@clerk/nextjs/server'
import { jsonResponse } from '@/lib/response';
// addPayment
export async function POST(req, { params }) {
    await dbConnect();

    try {
        const { job } = await params;
        const { userId } = await auth();
        const { employeeId, amountPaid, method, note, paidAt } = await req.json();

        const validatePaymentInputResponse = await validatePaymentInput({ employeeId, amountPaid, job, method, userId });
        console.log(validatePaymentInputResponse);
        
        if (validatePaymentInputResponse) return validatePaymentInputResponse

        const summary = await EmployeeSummary.findOne({ employeeId, createdBy: userId });
        const beforeAmountPaid = summary.totalUnpaidAmount || 0;

        let paidDates = []; // amount which is remain after salary settled

        if (job === 'tying' || job === 'dyeing') {
            ({ paidDates } = await handleTimeBasedPayment({
                employeeId, amountPaid, summary, createdBy: userId
            }));
        } 
        else if (job === 'asu-marking' || job === 'asu-winding') {
            await handleTaskBasedPayment(
                {employeeId, amountPaid, summary, createdBy: userId }
            );
        }


        await PaymentRecord.create({
            employeeId,
            amountPaid,
            method,
            note,
            beforeAmountPaid,
            createdBy: userId,
            paidDates: (job === 'tying' || job === 'dyeing') ? paidDates : undefined,
            ...(paidAt ? { paidAt } : {})
        });

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

//getPaymentRecord
export async function GET(req) {
    await dbConnect();

    try {
        const url = new URL(req.url);
        const employeeId = url.searchParams.get('employeeId');
        const { userId } = await auth();

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
        }

        const records = await PaymentRecord.find({ employeeId, createdBy: userId }).sort({ paidAt: -1 });

        if (!records || records.length === 0) {
            return NextResponse.json({ message: 'No payment record found for this employee.' }, { status: 200 });
        }

        return NextResponse.json(records, { status: 200 });
    } catch (error) {
        console.error('Error fetching payment record:', error);
        return NextResponse.json({ error: 'Server error. Could not fetch payment record.' }, { status: 500 });
    }
}