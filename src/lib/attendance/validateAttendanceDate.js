import { NextResponse } from 'next/server';

export function validateAttendanceDate({ formattedDate, employee, summary }) {
    const now = new Date();

    if (formattedDate > now) {
        return NextResponse.json({ message: 'Cannot mark attendance for future date.' }, { status: 400 });
    }
    if (formattedDate < new Date(employee.joinDate)) {
        return NextResponse.json({ message: 'Date is before employee join date.' }, { status: 400 });
    }
    if (formattedDate < summary.lastPaidDay) {
        return NextResponse.json({ message: 'Date is before last paid day.' }, { status: 400 });
    }

    return null;
}
