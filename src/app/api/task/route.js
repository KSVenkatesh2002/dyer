// /app/api/task/route.js
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/task.model';
import Product from '@/models/product.model';
import { auth } from '@clerk/nextjs/server';
import { updateEmployeeSummary } from '@/lib/helpers/task.utils';
import { NextResponse } from 'next/server';
import Client from '@/models/client.model'
import EmployeeSummary from '@/models/employeeSummary.model';

import { getProductAssignName } from '@/lib/helpers/product.utils';

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, employeeId, pays, job } = await req.json();

        if (!productId || !employeeId || pays <= 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let assigned;
        switch (job) {
            case 'asu-winding':
                assigned = 'windingAssigned';
                break;
            case 'asu-marking':
                assigned = 'markingAssigned';
                break;
            case 'chittam':
                assigned = 'chittamAssigned';
                break;
            default:
                return NextResponse.json({ error: 'Invalid or missing job parameter' }, { status: 400 });
        }

        // Set assigned flag
        await Product.findOneAndUpdate(
            { _id: productId, createdBy: userId },
            { [assigned]: true }
        );

        // Update Employee Summary
        await updateEmployeeSummary({ employeeId, pays, createdBy: userId });

        // Create Task
        await Task.create({
            employeeId,
            productId,
            pays,
            createdBy: userId,
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('[MARKING_TASK_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

// remove task for employee
export async function DELETE(req) {
    try {
        await dbConnect();
        const { userId } = await auth();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const taskId = searchParams.get('taskId');
        const job = searchParams.get('job');

        if (!taskId || !job) {
            return new Response(JSON.stringify({ error: 'Missing taskId or job' }), { status: 400 });
        }

        // 1. Find and delete the task
        const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

        if (!task) {
            return new Response(JSON.stringify({ error: 'Task not found or already deleted' }), { status: 404 });
        }

        const { productId, employeeId, pays } = task;

        // 2. Remove assigned flag from product
        const product = await Product.findOne({ _id: productId, createdBy: userId });

        if (product) {
            const field = await getProductAssignName(job);
            product[field] = false;
            await product.save();
        }

        // 3. Adjust EmployeeSummary
        const summary = await EmployeeSummary.findOne({ employeeId, createdBy: userId });

        if (summary) {
            await EmployeeSummary.findOneAndUpdate(
                { employeeId, createdBy: userId },
                {
                    $inc: {
                        totalUnpaidAmount: -pays,
                    },
                }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('[DELETE_TASK_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}