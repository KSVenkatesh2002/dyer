export function handleNewChange({ status, salary, summary, formattedDate }) {
    let partialPay = 0;
    let paid = false;

    if (status === 'present' || status === 'half') {
        if (status === 'present') {
            summary.totalFullDays++;
            summary.unpaidFullDays++;
        } else {
            summary.totalHalfDays++;
            summary.unpaidHalfDays++;
        }

        summary.totalUnpaidAmount += salary;

        if (summary.advancePay > 0) {
            if (summary.advancePay >= salary) {
                summary.advancePay -= salary;
                summary.totalUnpaidAmount -= salary;
            } else {
                partialPay = salary - summary.advancePay;
                summary.totalUnpaidAmount -= summary.advancePay;
                summary.unpaidPartialAmount = partialPay;
                summary.advancePay = 0;
            }

            // Since advancePay is applied, it's considered paid
            if (status === 'present') summary.unpaidFullDays--;
            if (status === 'half') summary.unpaidHalfDays--;
            paid = true;
            summary.lastPaidDay = new Date(formattedDate);
        }

    } else if (status === 'absent') {
        summary.totalAbsentDays++;
    } else if (status === 'holiday') {
        partialPay = 0;
    }

    return { paid, partialPay };


}