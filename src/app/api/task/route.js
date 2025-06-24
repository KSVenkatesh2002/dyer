// /app/api/task/route.js
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/task.model';
import Product from '@/models/product.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { auth } from '@clerk/nextjs/server';

const assignList = ['markingAssigned', 'windingAssigned', 'chittamAssigned']

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const { productId, employeeId, pays, assign } = await req.json();

        if (!productId || !employeeId || pays <= 0) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        if (!assignList.includes(assign)) {
            return new Response(JSON.stringify({ error: 'assign field not match' }), { status: 400 });
        }

        // Mark product as assigned
        await Product.findOneAndUpdate({ _id: productId, createdBy: userId }, { [assign]: true });

        // 2. Fetch or Create EmployeeSummary
        let summary = await EmployeeSummary.findOne({
            employeeId,
            createdBy: userId
        });

        if (!summary) {
            summary = await EmployeeSummary.create({
                employeeId,
                createdBy: userId,
                totalPaidAmount: 0,
                totalUnpaidAmount: 0,
                advancePay: 0
            });
        }

        // Calculate unpaid amount after using advance
        let remainingAmount = pays;
        let usedAdvance = 0;

        if (summary.advancePay > 0) {
            usedAdvance = Math.min(summary.advancePay, pays);
            remainingAmount = pays - usedAdvance;
        }

        // Create the task
        await Task.create({
            employeeId,
            productId,
            pays,
            createdBy: userId,
        });

        // Update Summary
        await EmployeeSummary.findOneAndUpdate(
            { employeeId, createdBy: userId },
            {
                $inc: {
                    totalUnpaidAmount: remainingAmount,
                    advancePay: -usedAdvance
                }
            }
        );

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('[MARKING_TASK_ERROR]', error);
        return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
    }
}
