import mongoose from "mongoose";
import { jsonResponse } from "../response";
import { NextResponse } from "next/server";
import Employee from "@/models/employee.model";

const jobList = ['tying','dyeing','asu-marking','asu-winding']
export async function validatePaymentInput({ employeeId, amountPaid, userId, job }) {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) 
        return NextResponse.json({error:'Invalid employee ID'},{status: 400});
    if (amountPaid <= 0) 
        return NextResponse.json({error:'Incorrect amount entered'},{status: 400});
    if (!userId)
        return jsonResponse({ error: 'Unauthorized' }, 401);
    if (!jobList.includes(job)) 
        return jsonResponse({ error: 'work type not match' }, 404);

    const employee = await Employee.findOne({_id: employeeId, job, createdBy: userId});
    if(!employee) 
        return NextResponse.json({error:'employee not found'},{status: 404});

    return null
}
