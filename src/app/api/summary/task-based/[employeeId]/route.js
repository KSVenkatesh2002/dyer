import PaymentRecord from '@/models/paymentRecord.model';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@clerk/nextjs/server';
import EmployeeSummary from '@/models/employeeSummary.model';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { employeeId } = await params;
        const { userId } = await auth();
        if (!userId) return new Response('Unauthorized', { status: 401 });

        const employeeSummary = await EmployeeSummary.findOne({ employeeId });
        
        const summary = {
            paid: employeeSummary.totalPaidAmount,
            unpaid: employeeSummary.totalUnpaidAmount,
            advance: employeeSummary.advancePay,
        }

        return new Response(JSON.stringify(summary), { status: 200 });
    } catch (error) {
        console.log('error in get salary summary', error);

        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}
