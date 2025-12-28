import Task from "@/models/task.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// get task list with product details for employees
export async function GET(req, { params }) {
  await dbConnect();
  const { employeeId } = await params;

  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const tasks = await Task.find({ employeeId, createdBy: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "productId",
      populate: { path: "clientId", select: "name" },
    })
    .lean();

  return new Response(JSON.stringify(tasks), { status: 200 });
}
