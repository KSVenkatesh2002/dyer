// /app/api/marking-task/route.js
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/task.model';
import Product from '@/models/product.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

export async function POST(req) {
    try {
        console.log('hello');
        
        await dbConnect();
        const { userId } = await auth();
        if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const { productId, employeeId, pays } = await req.json();

        if (!productId || !employeeId || pays <= 0) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Mark product as assigned
        await Product.findOneAndUpdate({ _id:productId, createdBy: userId }, { markingAssigned: true });

        // Create the task
        await Task.create({
            productId,
            employeeId,
            pays,
            createdBy: userId,
        });
        console.log('pays',pays)
        await EmployeeSummary.findOneAndUpdate(
            { employeeId, createdBy: userId },
            { $inc: { totalUnpaidAmount: Number(pays) } }, // ✅ now it's valid
            { new: true }
        );

        return new Response(null, { status: 204 });
    } catch (err) {
        console.error('[MARKING_TASK_ERROR]', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
