import Attendance from '@/models/attendance.model';

export async function handleTimeBasedPayment({ employeeId, amountPaid, summary, createdBy }) {
    const attendanceRecords = await Attendance.find({
        employeeId,
        createdBy,
        date: { $gte: summary.lastPaidDay }
    }).sort({ date: 1 });
    console.log('attendances list ', attendanceRecords);

    let tempPaidAmount = amountPaid;
    const paidDates = [];

    for (const record of attendanceRecords) {
        if (tempPaidAmount <= 0) break;

        if (record.partialPay > 0 && record.paid) {
            if (record.partialPay > tempPaidAmount) {
                record.partialPay -= tempPaidAmount;
                summary.unpaidPartialAmount -= tempPaidAmount;
                tempPaidAmount = 0;
            } else {
                tempPaidAmount -= record.partialPay;
                summary.unpaidPartialAmount -= record.partialPay;
                record.partialPay = 0;
            }

            await record.save();
            summary.lastPaidDay = record.date;
            paidDates.push(record.date);
            continue;
        }

        if (!record.paid) {
            if (tempPaidAmount >= record.salary) {
                tempPaidAmount -= record.salary;
                record.partialPay = 0;
            } else {
                record.partialPay = record.salary - tempPaidAmount;
                summary.unpaidPartialAmount += record.partialPay;
                tempPaidAmount = 0;
            }

            if (record.status === 'present') {
                summary.unpaidFullDays = Math.max(0, summary.unpaidFullDays - 1);
                paidDates.push(record.date);
            } else if (record.status === 'half') {
                summary.unpaidHalfDays = Math.max(0, summary.unpaidHalfDays - 1);
                paidDates.push(record.date);
            }

            record.paid = true;
            summary.lastPaidDay = new Date(record.date);
            await record.save();
        }
    }

    // maintain salary credit
    summary.totalUnpaidAmount = Math.max(0, summary.totalUnpaidAmount - amountPaid);
    summary.totalPaidAmount += amountPaid;


    // add advance amount
    if (tempPaidAmount > 0) {
        summary.advancePay = (summary.advancePay || 0) + tempPaidAmount;
    }
    await summary.save();

    return { paidDates };
}
