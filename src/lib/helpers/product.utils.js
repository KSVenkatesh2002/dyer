export async function getProductAssignName(job) {
    switch (job) {
        case 'asu-winding':
            return 'windingAssigned';
        case 'asu-marking':
            return 'markingAssigned';
        case 'chittam':
            return 'chittamAssigned';
        default:
            throw new Error('Invalid or missing job parameter')
    }
}