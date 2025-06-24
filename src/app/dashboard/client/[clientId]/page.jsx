'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { getClientDetails, getProducts } from '@/lib/api';
import { ProductList } from '@/components/productList';

export default function ClientDetailsPage() {
    const params = useParams();
    const clientId = params.clientId;
    const [client, setClient] = useState(null);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);


    const fetchProducts = async (pageNum = page, reset = false) => {
        if (!hasMore || loadingProducts) return;
        setLoadingProducts(true);

        try {
            const res = await getProducts(pageNum, clientId);
            console.log(res)
            const { products: newProducts, hasMore: more } = res.data;

            setProducts(prev => reset ? newProducts : [...prev, ...newProducts]); // ✅ handle reset

            setHasMore(more);
            setPage(pageNum + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProducts(false);
        }
    };
    useEffect(() => {
        (async () => {
            try {
                const clientRes = await getClientDetails(clientId)
                setClient(clientRes.data)

                await fetchProducts(1, true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingPage(false);
            }
        })();
    }, []);

    if (loadingPage) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center text-gray-500 mt-10">
                Client not found or failed to load.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>

            <div className="border text-white rounded-lg p-4 bg-background/50 shadow-sm space-y-4">
                <DetailRow label="Name" value={client.name} />
                <DetailRow label="Phone" value={client.phone} />
                <DetailRow label="Address" value={client.address || 'N/A'} />
                <DetailRow label="Notes" value={client.notes || 'None'} />
                <DetailRow
                    label="Last Ordered"
                    value={
                        client.lastOrderedAt
                            ? format(new Date(client.lastOrderedAt), 'dd MMM yyyy')
                            : 'Never'
                    }
                />
                <DetailRow
                    label="Status"
                    value={
                        client.isActive ? (
                            <span className="text-green-600 font-medium">Active</span>
                        ) : (
                            <span className="text-red-600 font-medium">Inactive</span>
                        )
                    }
                />
            </div>
            <ProductList
                title="Products"
                items={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
            />

            {hasMore && (
                <div className="text-center mt-4">
                    <button className="btn-secondary" onClick={() => fetchProducts()} disabled={loadingProducts}>
                        {loadingProducts ? 'Loading...' : 'Load More Products'}
                    </button>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-start border-b pb-2">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="text-right text-gray-800">{value}</span>
        </div>
    );
}