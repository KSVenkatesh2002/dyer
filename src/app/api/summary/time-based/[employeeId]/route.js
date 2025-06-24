import dbConnect from "@/lib/dbConnect";
import { auth } from '@clerk/nextjs/server';
import EmployeeSummary from "@/models/employeeSummary.model";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { employeeId } = await params;
        const { userId } = await auth();
        if (!userId) return new Response('Unauthorized', { status: 401 });

        const employeeSummary = await EmployeeSummary.findOne({ employeeId, createdBy: userId });

        return new Response(JSON.stringify({
            totalUnpaidAmount: employeeSummary?.totalUnpaidAmount || 0,
            totalFullDays: employeeSummary?.totalFullDays || 0,
            totalHalfDays: employeeSummary?.totalHalfDays || 0,
            totalAbsentDays: employeeSummary?.totalAbsentDays || 0,
            unpaidFullDays: employeeSummary?.unpaidFullDays || 0,
            unpaidHalfDays: employeeSummary?.unpaidHalfDays || 0,
            unpaidPartialAmount: employeeSummary?.unpaidPartialAmount || 0,
            totalPaidAmount: employeeSummary?.totalPaidAmount || 0,
            advancePay: employeeSummary?.advancePay || 0,
            lastPaidDay: employeeSummary?.lastPaidDay || null,
        }), { status: 200 });
    } catch (error) {
        console.error('error in get time based salary summary', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}