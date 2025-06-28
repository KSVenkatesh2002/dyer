'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEmployeeDetailsById, getTasks, paymentSummary, removeTask } from '@/lib/api';
import Link from 'next/link';
import NoData from '@/components/NoData';
import { ProductList } from '@/components/productList';
import { toast } from 'react-toastify';

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

    const handleRemoveTask = async (taskId) => {
        try {
            await removeTask({ taskId, job: employee.job })
            
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success("Task removed");
        } catch (error) {
            toast.error( error?.response?.data?.error || "Failed to remove task");
            console.error(error);
        }
    };

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
            <ProductList
                title="Assigned Products"
                items={tasks}
                isTaskList={true}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                onRemoveTask={handleRemoveTask}
            />

        </div>
    );
}
