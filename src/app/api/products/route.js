import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Product from '@/models/product.model';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {

        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const clientId = searchParams.get('clientId');
        const skip = (page - 1) * limit;
        
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return NextResponse.json({ error: 'Invalid clientId format' });
        }

        const products = await Product.find({
            clientId,
            createdBy: userId,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('productId createdAt nailsCount kolukkulu varasalu repeat numberOfSarees windingAssigned markingAssigned sariSection conesUsed');

        const totalCount = await Product.countDocuments({
            clientId,
            createdBy: userId,
        });

        return new Response(
            JSON.stringify({
                products,
                total: totalCount,
                hasMore: skip + products.length < totalCount,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error('[FETCH_UNASSIGNED_PRODUCTS]', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}