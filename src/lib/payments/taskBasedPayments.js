export async function handleTaskBasedPayment({ employeeId, amountPaid, summary, createdBy }) {
    if(amountPaid <= summary.totalUnpaidAmount){
        summary.totalUnpaidAmount -= amountPaid
    } else if(amountPaid > summary.totalUnpaidAmount){
        summary.advancePay = amountPaid - summary.totalUnpaidAmount
        summary.totalUnpaidAmount = 0
    }
    
    summary.totalPaidAmount += amountPaid; // add total paid amount

    await summary.save();
}
