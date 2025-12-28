import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import Task from "@/models/task.model";
import Client from "@/models/client.model";
import { generateSafeProductId } from "@/lib/products/utils";
import { auth } from "@clerk/nextjs/server";
import Employee from "@/models/employee.model";
import { updateEmployeeSummary } from "@/lib/helpers/task.utils";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    clientId,
    sariSection,
    nailsCount,
    conesUsed,
    kolukkulu,
    varasalu,
    repeat,
    sareesCount,
    designName,
    repeatType,
    borderInches,
    employeeId,
    pays,
  } = body;

  if (!clientId || !employeeId || !sariSection || pays <= 0) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const field = {
      clientId,
      sariSection,
      nailsCount,
      conesUsed,
      kolukkulu,
      varasalu,
      repeat,
      sareesCount,
      designName,
      repeatType,
      borderInches,
      createdBy: userId,
    };

    const employeeJob = await Employee.findOne({
      _id: employeeId,
      createdBy: userId,
    });
    if (!employeeJob) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 400 }
      );
    }

    switch (employeeJob.job) {
      case "asu-winding":
        field.windingAssigned = true;
        break;
      case "asu-marking":
        field.markingAssigned = true;
        break;
      case "chittam":
        field.chittamAssigned = true;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid or missing job parameter" },
          { status: 400 }
        );
    }

    const productId = await generateSafeProductId(
      clientId,
      sariSection,
      userId
    );
    field.productId = productId;

    const product = await Product.create([field]);

    await Client.findOneAndUpdate(
      { _id: clientId, createdBy: userId },
      { lastOrderedAt: new Date() }
    );

    await updateEmployeeSummary({
      employeeId,
      pays,
      createdBy: userId,
    });

    await Task.create([
      {
        productId: product[0]._id,
        employeeId,
        pays,
        createdBy: userId,
      },
    ]);

    return NextResponse.json({ success: true, productId }, { status: 201 });
  } catch (error) {
    console.error("[WITH_TASK_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
