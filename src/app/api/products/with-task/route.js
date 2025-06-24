import dbConnect from '@/lib/dbConnect';
// import mongoose from 'mongoose';
import Product from '@/models/product.model';
import Task from '@/models/task.model';
// import Employee from '@/models/employee.model';
import Client from '@/models/client.model';
import EmployeeSummary from '@/models/employeeSummary.model';
import { generateSafeProductId } from '@/lib/products/utils';
import { auth } from '@clerk/nextjs/server';

export async function POST(req) {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const {
        sariSection,
        clientId,
        nailsCount,
        conesUsed,
        kolukkulu,
        varasalu,
        repeat,
        numberOfSarees,
        designName,
        employeeId,
        pays,
    } = await req.json();

    if (!clientId || !employeeId || !sariSection || pays <= 0) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try {
        const productId = await generateSafeProductId(clientId, sariSection, userId);
        const taskAmount = pays * numberOfSarees * repeat;

        // 1. Create the Product
        const product = await Product.create([{
            productId,
            sariSection,
            clientId,
            nailsCount,
            conesUsed,
            kolukkulu,
            varasalu,
            repeat,
            numberOfSarees,
            designName,
            windingAssigned: true,
            createdBy: userId
        }]);

        await Client.findOneAndUpdate(
            { _id: clientId, createdBy: userId },
            { lastOrderedAt: new Date() }
        );

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

        // 3. Calculate unpaid amount after using advance
        let remainingAmount = taskAmount;
        let usedAdvance = 0;

        if (summary.advancePay > 0) {
            usedAdvance = Math.min(summary.advancePay, taskAmount);
            remainingAmount = taskAmount - usedAdvance;
        }

        // 4. Create Task
        await Task.create([{
            productId: product[0]._id,
            employeeId,
            pays: taskAmount,
            createdBy: userId
        }]);

        // 5. Update Summary
        await EmployeeSummary.findOneAndUpdate(
            { employeeId, createdBy: userId },
            {
                $inc: {
                    totalUnpaidAmount: remainingAmount,
                    advancePay: -usedAdvance
                }
            }
        );

        return new Response(JSON.stringify({ success: true, productId }), { status: 201 });

    } catch (error) {
        console.error('[WITH_TASK_ERROR]', error);
        return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
    }
}
