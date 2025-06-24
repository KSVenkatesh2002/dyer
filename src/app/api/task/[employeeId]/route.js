import Task from '@/models/task.model';
import Product from '@/models/product.model';
import Client from '@/models/client.model'

import dbConnect from '@/lib/dbConnect';
import { auth } from '@clerk/nextjs/server';

export async function GET(req, { params }) {
    await dbConnect();
    const { employeeId } = await params

    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const tasks = await Task.find({ employeeId, createdBy: userId })
        .populate({
            path: 'productId',
            populate: { path: 'clientId', select: 'name' }  
        })
        .lean();

    return new Response(JSON.stringify(tasks), { status: 200 });
}
