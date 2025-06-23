// /app/api/products/marking-unassigned/route.js

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product.model';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
    try {

        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const unassignedProducts = await Product.find({
            markingAssigned: false,
            createdBy: userId,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('productId createdAt nailsCount kolukkulu varasalu repeat numberOfSarees windingAssigned markingAssigned');

        const totalCount = await Product.countDocuments({
            markingAssigned: false,
            createdBy: userId,
        });

        return new Response(
            JSON.stringify({
                products: unassignedProducts,
                total: totalCount,
                hasMore: skip + unassignedProducts.length < totalCount,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error('[FETCH_UNASSIGNED_PRODUCTS]', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
