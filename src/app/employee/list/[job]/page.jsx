'use client';
import { useEffect, useState } from 'react';
import { addTask, getEmployeesListByJob, getProductsUnassigned } from '@/lib/api';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from 'next/link';
import NoData from '@/components/NoData';
import { useParams } from 'next/navigation';

export default function EmployeesListTaskBased() {
    const params = useParams();
    const job = params.job
    const [employees, setEmployees] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [pays, setPays] = useState('');

    const fetchProducts = async (pageNum = page, reset = false) => {
        if (!hasMore || loadingProducts) return;
        setLoadingProducts(true);

        try {
            const res = await getProductsUnassigned(pageNum, job);
            const { products: newProducts, hasMore: more } = res.data;

            setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);

            setHasMore(more);
            setPage(pageNum + 1);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to fetch', { theme: 'colored' });
        } finally {
            setLoadingProducts(false);
        }
    };


    useEffect(() => {

        const fetchData = async () => {
            try {
                const empRes = await getEmployeesListByJob(job);
                setEmployees(empRes.data);

                setHasMore(true);
                await fetchProducts(1, true);
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.error || 'Failed to fetch', { theme: 'colored' });
            } finally {
                setLoadingPage(false);
            }
        };
        fetchData();
    }, []);


    const handleSelect = (e, empId) => {
        const prod = products.find(p => p._id === e.target.value);
        setSelectedProduct(prod);
        setSelectedEmployeeId(empId);
        setPays('');
    };

    const handleAssign = async () => {
        if (!selectedProduct || !pays || !selectedEmployeeId) {
            return toast.error('Fill all fields before assigning');
        }

        try {
            await addTask({
                productId: selectedProduct._id,
                employeeId: selectedEmployeeId,
                pays: Number(pays),
                assign: 'markingAssigned'
            });

            toast.success('Task assigned successfully!');

            setSelectedProduct(null);
            setSelectedEmployeeId(null);
            setPays('');

            if (hasMore) {
                setProducts([]);
                setHasMore(true);
                setPage(1);
                await fetchProducts(1, true);
            } else {
                setProducts(prev => prev.filter(p => p._id !== selectedProduct._id));
            }

        } catch (err) {
            toast.error('Failed to assign task');
            console.error(err);
        }
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setSelectedEmployeeId(null);
        setPays('');
    };

    if (loadingPage || loadingProducts) {
        return (
            <p className='min-h-[calc(100vh-64px)] flex justify-center items-center'>
                <AiOutlineLoading3Quarters className='animate-spin' />
            </p>
        );
    }

    if (!loadingPage && !loadingProducts && (!employees || employees.length === 0)) {
        return <NoData text={'No employees available'} />
    }

    return (
        <>
            <div className="py-8 max-w-3xl mx-auto w-full space-y-4 px-4">
                <div className='text-2xl font-bold mb-4 capitalize'>
                    {job} Employees List
                </div>
                {hasMore && (
                    <div className="text-center mt-4">
                        <button className="btn-secondary border-2 text-accent/80 p-1 font-semibold rounded-lg" onClick={() => fetchProducts()} disabled={loadingProducts}>
                            {loadingProducts ? 'Loading...' : 'Get More Products'}
                        </button>
                    </div>
                )}
                {/* emp list */}
                <ul className="space-y-4">
                    {employees.map(emp => (

                        // single emp
                        <li key={emp._id} className="flex flex-wrap justify-between items-center p-3 rounded-lg shadow bg-background text-text">

                            {/* emp name */}
                            <Link href={`/dashboard/task-based/${emp._id}`} className="text-lg font-semibold capitalize block w-full py-2">
                                {emp.name}
                            </Link>

                            {/* product list */}
                            <select
                                onChange={(e) => handleSelect(e, emp._id)}
                                value={selectedEmployeeId === emp._id && selectedProduct ? selectedProduct._id : ''}
                                className="input-style"
                            >
                                <option value="">Select Product</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.productId} — {new Date(p.createdAt).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>

                            {/* navigate to add product page */}
                            <Link
                                href={`/products/add/${emp._id}`}
                                className='text-md font-semibold border-2 p-1.5 rounded-lg text-white '
                            >
                                Create Task
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-10">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl">
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-2">Product Details</h2>
                        <div className="space-y-1 text-sm">
                            <p><strong>ID:</strong> {selectedProduct.productId}</p>
                            <p><strong>Client:</strong> {selectedProduct.clientName}</p>
                            <p><strong>Design No:</strong> {selectedProduct.designNumber}</p>
                            <p><strong>Nails:</strong> {selectedProduct.nailsCount}</p>
                            <p><strong>Kolukkulu:</strong> {selectedProduct.kolukkulu}</p>
                            <p><strong>Varasalu:</strong> {selectedProduct.varasalu}</p>
                            <p><strong>Repeat:</strong> {selectedProduct.repeat}</p>
                            <p><strong>Sarees:</strong> {selectedProduct.numberOfSarees}</p>
                            <p><strong>Winding Done:</strong> {selectedProduct.windingAssigned ? 'Yes' : 'No'}</p>
                            <p><strong>Marking Done:</strong> {selectedProduct.markingAssigned ? 'Yes' : 'No'}</p>
                            <p><strong>chittam Done:</strong> {selectedProduct.chittamAssigned ? 'Yes' : 'No'}</p>
                            <p><strong>Created At:</strong> {new Date(selectedProduct.createdAt).toLocaleString()}</p>
                        </div>

                        <input
                            type="number"
                            className="input-style mt-3 w-full"
                            placeholder="Enter Pays"
                            value={pays}
                            onChange={e => setPays(e.target.value)}
                        />

                        <button onClick={handleAssign} className="btn-primary w-full mt-3">
                            Assign Task
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
