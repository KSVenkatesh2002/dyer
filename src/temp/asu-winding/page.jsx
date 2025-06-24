'use client';
import { useEffect, useState } from 'react';
import { getEmployeesListByJob } from '@/lib/api';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from 'next/link';
import NoData from '@/components/NoData';

export default function AsuWindingEmployeesList() {
    const job = 'asu-winding'
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getEmployeesListByJob(job)
            .then(res => setEmployees(res.data))
            .catch(error => {
                // console.error('Error while fetch emp list page:', error);
                toast.error(error.response?.data?.error || 'Failed to fetch employees. Try again.', { theme: 'colored' });
            })
            .finally(setLoading(false));
    }, []);

    if (loading) {
        return (
            <p className='min-h-[calc(100vh-64px)] flex justify-center items-center'>
                <AiOutlineLoading3Quarters className='animate-spin' />
            </p>
        );
    }
    if (!loading && (!employees || employees.length === 0)) {
        return <NoData text={'No employees available'} />
    }

    return (
        <div className="py-8 max-w-3xl mx-auto w-full space-y-4 px-4">
            {/* heading */}
            <div className='flex flex-row items-baseline justify-between mb-4 text-2xl font-bold capitalize'>
                {job} employees list
            </div>

            {/* emp list */}
            <ul className="space-y-4">{
                employees.map(emp => (

                    // single emp
                    <li key={emp._id} className="flex justify-between items-center p-3 rounded-lg shadow-md shadow-gray-400 gap-2 bg-background/50">

                        {/* emp name */}
                        <Link
                            href={`/dashboard/task-based/${emp._id}`}
                            className='text-md'
                        >
                            <div className='text-lg font-semibold  capitalize'>
                                {emp.name}
                            </div>
                        </Link>

                        <Link
                            href={`/products/add/${emp._id}`}
                            className='text-md border p-1.5 rounded-lg bg-accent/10 text-accent border-accent'
                        >
                            Create Task
                        </Link>
                    </li>

                ))
            }</ul>

        </div>
    );
}