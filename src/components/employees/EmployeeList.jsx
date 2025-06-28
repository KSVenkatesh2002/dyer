'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEmployeesListByJob } from '@/lib/api';

export default function EmployeesByJob({ job, type }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!job) return;

        const fetchEmployees = async () => {
            try {
                const res = await getEmployeesListByJob(job);
                setEmployees(res.data);
            } catch (err) {
                console.error('Failed to fetch employees', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [job]);

    return (
        <div className="space-y-4 p-3 bg-secondary m-2 my-4 rounded-2xl shadow-lg shadow-gray-400">
            <h2 className="text-lg font-bold capitalize">{job.replace('-', ' ')} Employees</h2>
            {loading
                ? <p className='text-center text-white'>Loading employees...</p>
                : <>{
                    employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <ul className="grid gap-2">
                            {employees.map(emp => (
                                <li key={emp._id} className="bg-surface/80 shadow p-3 rounded-md flex justify-between items-center">
                                    <span className="capitalize">{emp.name}</span>
                                    <Link
                                        href={`/dashboard/${type}/${emp._id}`}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        dashboard
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                }</>
            }
        </div>
    );
}