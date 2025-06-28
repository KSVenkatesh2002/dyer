import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Product from '@/models/product.model';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { generateSafeProductId } from '@/lib/products/utils';

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
    } catch (error) {
        console.error('[FETCH_UNASSIGNED_PRODUCTS]', error);
        return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await req.json();
        const {
            sariSection,
            clientId,
        } = body;

        if (!clientId || !sariSection) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const productId = await generateSafeProductId(clientId, sariSection, userId);

        const newProduct = await Product.create({
            productId,
            ...body,
            windingAssigned: false,
            markingAssigned: false,
            chittamAssigned: false,
            createdBy: userId
        });

        return NextResponse.json(newProduct.productId, { status: 201 });

    } catch (error) {
        console.error('[CREATE_PRODUCT_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}