import { NextResponse } from "next/server";

export function buildResponse(summary, status, paid, returnType) {
    const base = {
        message: 'Attendance marked successfully.',
        unpaidFullDays: summary.unpaidFullDays,
        unpaidHalfDays: summary.unpaidHalfDays,
        totalUnpaidAmount: summary.totalUnpaidAmount,
        unpaidPartialAmount: summary.unpaidPartialAmount,
        updatedAttendance: { status, paid },
    };

    if (returnType === 'simple') return NextResponse.json(base, { status: 200 });

    return NextResponse.json({
        ...base,
        totalFullDays: summary.totalFullDays,
        totalHalfDays: summary.totalHalfDays,
        totalAbsentDays: summary.totalAbsentDays,
        totalPaidAmount: summary.totalPaidAmount,
        advancePay: summary.advancePay || 0,
        lastPaidDay: summary.lastPaidDay,
    }, { status: 200 });
}
