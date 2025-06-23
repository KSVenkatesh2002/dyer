export function handleRemoveChanges({ existing, summary, salaryPerDay }) {
    if (!existing) return;

    switch (existing.status) {
        case 'present':
            summary.totalFullDays--;
            summary.unpaidFullDays--;
            summary.totalUnpaidAmount -= salaryPerDay;
            break;
        case 'half':
            summary.totalHalfDays--;
            summary.unpaidHalfDays--;
            summary.totalUnpaidAmount -= salaryPerDay / 2;
            break;
        case 'absent':
            summary.totalAbsentDays--;
            break;
        // Optional: handle 'holiday' if needed
    }
}
