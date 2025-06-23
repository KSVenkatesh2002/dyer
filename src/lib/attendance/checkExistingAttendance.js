import { NextResponse } from 'next/server';

export function checkExistingAttendance(existing, status) {
    if (existing?.paid) {
        return NextResponse.json({ message: "Can't change paid day" }, { status: 400 });
    }

    if (existing?.status === status) {
        return NextResponse.json({ message: "Same status as existing" }, { status: 400 });
    }

    return null;
}
