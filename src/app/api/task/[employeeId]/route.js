import Task from '@/models/task.model';
import Product from '@/models/product.model';
import Client from '@/models/client.model'
import EmployeeSummary from '@/models/employeeSummary.model';

import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getProductAssignName } from '@/lib/helpers/product.utils';

// get task list with product details for employees
export async function GET(req, { params }) {
    await dbConnect();
    const { employeeId } = await params

    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const tasks = await Task.find({ employeeId, createdBy: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'productId',
            populate: { path: 'clientId', select: 'name' }
        })
        .lean();

    return new Response(JSON.stringify(tasks), { status: 200 });
}

