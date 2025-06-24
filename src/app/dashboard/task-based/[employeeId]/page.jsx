'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEmployeeDetailsById, getTasks, paymentSummary } from '@/lib/api';
import Link from 'next/link';
import NoData from '@/components/NoData';
import { ProductList } from '@/components/productList';

export default function WindingEmployeeDashboard() {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [empRes, taskRes, sumRes] = await Promise.all([
                    getEmployeeDetailsById(employeeId),
                    getTasks(employeeId),
                    paymentSummary(employeeId)
                ]);
                setEmployee(empRes.data);
                setTasks(taskRes.data);
                setSummary(sumRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [employeeId]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8" /> loading...</div>;

    if (!loading && !employee ) {
        return <NoData className="text-center text-error" text={'Employee not found.'} />
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Personal Info */}
            <section className="bg-surface rounded-lg p-4 shadow">
                <h2 className="text-xl font-semibold mb-2">Employee Details</h2>
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Phone:</strong> {employee.phone}</p>
                <p><strong>Joined:</strong> {new Date(employee.joinDate).toLocaleDateString()}</p>
                <p><strong>Work Type:</strong> {employee.job}</p>
            </section>

            {/* Salary Summary */}
            <section className="bg-surface rounded-lg p-4 shadow flex justify-around text-center">
                {['Paid', 'Unpaid', 'Advance'].map(type => (
                    <div key={type}>
                        <h3 className="font-medium">{type}</h3>
                        <p className="text-lg font-bold text-primary">₹ {summary[type.toLowerCase()]}</p>
                    </div>
                ))}
            </section>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Link href={`/payments/add/${employee.job}/${employeeId}`} className="bg-primary text-white px-4 py-2 rounded shadow">
                    Add Payment
                </Link>
                <Link href={`/payments/history/${employee.job}/${employeeId}`} className="bg-secondary text-white px-4 py-2 rounded shadow">
                    View Payment History
                </Link>
            </div>

            {/* Products List */}
            {/* <section className="bg-surface rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Assigned Products</h2>
                {tasks.length === 0 ? (
                    <p className="text-mutedText">No products assigned yet.</p>
                ) : (
                    <ul className="space-y-4"> 
                        {tasks.map(task => {
                            const product = task.productId;
                            const isSelected = selectedProductId === product._id;
                            return (
                                <li key={task._id}>
                                    <button
                                        onClick={() => setSelectedProductId(isSelected ? null : product._id)}
                                        className="w-full bg-accent/30 px-4 py-3 rounded-md flex justify-between items-center font-semibold transition"
                                    >
                                        {product.productId}
                                        <span className="italic text-sm text-right font-medium">₹{task.pays}</span>
                                    </button>

                                    {isSelected && (
                                        <div className="mt-2 border border-muted rounded p-4 bg-background/30  text-sm grid grid-cols-2 gap-4">
                                            <p className="flex items-center gap-2 uppercase"><IoIosPerson /> <strong className='capitalize'>Client:</strong> {product.clientId?.name || "N/A"}</p>
                                            <p className="flex items-center gap-2"><PiMapPinSimpleAreaFill /> <strong>Sari Section:</strong> {product.sariSection}</p>
                                            <p className="flex items-center gap-2"><GiNails /> <strong>Nails Count:</strong> {product.nailsCount}</p>
                                            <p className="flex items-center gap-2"><BiSolidTrafficCone /> <strong>Cones Used:</strong> {product.conesUsed}</p>
                                            <p className="flex items-center gap-2"><PiNumberEightLight className='rotate-90' /> <strong>Kolukkulu:</strong> {product.kolukkulu}</p>
                                            <p className="flex items-center gap-2"><MdOutlineRepeat /> <strong>Varasalu:</strong> {product.varasalu}</p>
                                            <p className="flex items-center gap-2"><BsArrowCounterclockwise /> <strong>Repeat:</strong> {product.repeat}</p>
                                            <p className="flex items-center gap-2"><LuTally5 /> <strong>Sarees:</strong> {product.numberOfSarees}</p>
                                            <p className="flex items-center gap-2"><MdDriveFileRenameOutline /> <strong>Design Name:</strong> {product.designName || "N/A"}</p>
                                            <p className="flex items-center gap-2"><GiTakeMyMoney /> <strong>Pay:</strong> ₹{task.pays}</p>
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </section> */}
            <ProductList
                title="Assigned Products"
                items={tasks}
                isTaskList={true}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
            />

        </div>
    );
}
