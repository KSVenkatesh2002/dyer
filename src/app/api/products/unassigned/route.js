import dbConnect from '@/lib/dbConnect';
import { fetchUnassignedProducts } from '@/lib/products/fetchUnassignedProducts';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        let field;

        switch (type) {
            case 'asu-winding':
                field = 'windingAssigned'
                break;
            case 'asu-marking':
                field = 'markingAssigned'
                break;
            case 'chittam':
                field = 'chittamAssigned'
                break;
            default:
                return new Response(JSON.stringify({ error: 'Invalid or missing type parameter' }), { status: 400 });
        }

        const result = await fetchUnassignedProducts({
            userId,
            field,
            page,
            limit,
        });

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('[FETCH_UNASSIGNED_PRODUCTS]', error);
        return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
    }
}
