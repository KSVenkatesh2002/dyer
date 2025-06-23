export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { employeeId } = await params;
        const { userId } = await auth();
        if (!userId) return new Response('Unauthorized', { status: 401 });

        const employeeSummary = await EmployeeSummary.findOne({ employeeId });
        // console.log('summary', employeeSummary);

        return new Response(JSON.stringify(employeeSummary), { status: 200 });
    } catch (error) {
console.log('error in get salary summary', error);

        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}