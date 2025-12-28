// app/api/attendance/route.js
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Employee from "@/models/employee.model";
import Attendance from "@/models/attendance.model";
import EmployeeSummary from "@/models/employeeSummary.model";

import { handleRemoveChanges } from "@/lib/attendance/removePreviousChanges";
import { handleNewChange } from "@/lib/attendance/addNewChanges";
import { validateAttendanceDate } from "@/lib/attendance/validateAttendanceDate";
import { checkExistingAttendance } from "@/lib/attendance/checkExistingAttendance";
import { buildResponse } from "@/lib/attendance/buildResponse";
import { calculateSalary } from "@/lib/attendance/calculateSalary";

//markAttendance
const validStatuses = ["present", "half", "absent", "holiday"];

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employeeId, status, date, returnType } = await req.json();

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error:
            'Invalid status. Must be "present", "half", "absent", or "holiday".',
        },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date);

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const summary = await EmployeeSummary.findOne({
      employeeId,
      createdBy: userId,
    });

    // Validate date
    const dateValidationResponse = validateAttendanceDate({
      formattedDate,
      employee,
      summary,
    });
    if (dateValidationResponse) return dateValidationResponse;

    // Calculate salary
    const salary = calculateSalary(status, employee.salaryPerDay);

    // Check for existing attendance
    const existing = await Attendance.findOne({
      employeeId,
      date: formattedDate,
      createdBy: userId,
    });
    const attendanceValidationResponse = checkExistingAttendance(
      existing,
      status
    );
    if (attendanceValidationResponse) return attendanceValidationResponse;

    // Adjust summary by removing previous and applying new change
    handleRemoveChanges({
      existing,
      summary,
      salaryPerDay: employee.salaryPerDay,
    });

    const { paid, partialPay } = handleNewChange({
      status,
      salary,
      summary,
      formattedDate,
    });

    // Upsert attendance record
    await Attendance.findOneAndUpdate(
      { employeeId, date: formattedDate },
      { status, salary, paid, partialPay, createdBy: userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await summary.save();

    return buildResponse(summary, status, paid, returnType);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
