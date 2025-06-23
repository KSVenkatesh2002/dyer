export function calculateSalary(status, salaryPerDay) {
    if (status === 'present') return salaryPerDay;
    if (status === 'half') return salaryPerDay / 2;
    return 0;
}
