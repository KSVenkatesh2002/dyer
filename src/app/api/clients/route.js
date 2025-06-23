import dbConnect from '@/lib/dbConnect';

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import Client from '@/models/client.model';

// add client
export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const {
            name,
            phone,
            address,
            notes,
        } = await req.json();

        //validate name
        const nameExists = await Client.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            createdBy: userId,
        });
        if (nameExists) return NextResponse.json({ error: 'Name already exists' }, { status: 401 });

        // validate phone
        if (!phone || phone.length < 10) {
            return NextResponse.json({ error: 'Please provide a valid phone number' }, { status: 401 });
        }
        const phoneExist = await Client.findOne({ phone, createdBy: userId });
        if (phoneExist) return NextResponse.json({ error: 'Phone already exists' }, { status: 401 });


        const newClient = new Client({
            name: name?.trim(),
            phone: phone?.trim(),
            address: address?.trim(),
            notes: notes?.trim(),
            createdBy: userId,
        });

        await newClient.save();


        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[ADD_client_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// get all clients
export async function GET() {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const clientList = await Client.aggregate([
            {
                $match: {
                    createdBy: { $eq: userId },
                },
            },
            {
                $project: {
                    name: 1,
                    isActive: 1,
                },
            },
            {
                $sort: {
                    isActive: -1, // true (1) first
                    name: 1       // alphabetical order
                },
            },
        ]);

        // const clientList = await Client.find({ createdBy: userId }).sort({ isActive: -1, name: 1, });

        return NextResponse.json( clientList , { status: 200 });
    } catch (error) {
        console.error('[ADD_client_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}