import EmployeeSummary from '@/models/employeeSummary.model';

export async function updateEmployeeSummary({ employeeId, pays, createdBy }) {
    let summary = await EmployeeSummary.findOne({ employeeId, createdBy });

    if (!summary) {
        summary = await EmployeeSummary.create({
            employeeId,
            createdBy,
            totalPaidAmount: 0,
            totalUnpaidAmount: 0,
            advancePay: 0,
        });
    }

    let remainingAmount = pays;
    let usedAdvance = 0;

    if (summary.advancePay > 0) {
        usedAdvance = Math.min(summary.advancePay, pays);
        remainingAmount = pays - usedAdvance;
    }

    await EmployeeSummary.findOneAndUpdate(
        { employeeId, createdBy },
        {
            $inc: {
                totalUnpaidAmount: remainingAmount,
                advancePay: -usedAdvance,
            },
        }
    );
}