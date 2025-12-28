import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import Client from "@/models/client.model";

/**
 * PATCH /api/client/[clientId]
 * Toggle the active status of a client
 */
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { clientId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await Client.findOne({ _id: clientId, createdBy: userId });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    client.isActive = !client.isActive;
    await client.save();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLIENT_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/client/[clientId]
 * Fetch details of a specific client
 */
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await params;
    const clientDetails = await Client.findOne({
      _id: clientId,
      createdBy: userId,
    });

    if (!clientDetails) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(clientDetails, { status: 200 });
  } catch (error) {
    console.error("[CLIENT_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
