'use client';
import { useEffect, useState } from 'react';
import { markAttendance, employeeListPage } from '@/lib/api';
import { toast } from 'react-toastify';
import { MdAutorenew, MdEdit, MdClose } from 'react-icons/md';
import Link from 'next/link';
import dayjs from 'dayjs'
import Skeleton from './loading';
import NoData from '@/components/NoData';

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState(null);
    const [attendanceMarkLoading, setAttendanceMarkLoading] = useState('');
    const [editId, setEditId] = useState('')
    const [loading, setLoading] = useState(true);

    const TODAY = dayjs().format('YYYY-MM-DD');

    const handleAttendanceChange = async (empId, status) => {
        setEditId('')
        if (attendanceMarkLoading !== '' && attendanceMarkLoading !== empId) {
            toast.error('Attendance already marking', { theme: 'dark' });
            return;
        }
        const previousStatus = employees.find(emp => emp._id === empId)?.attendanceStatus;
        if (previousStatus === status) {
            toast.info('Attendance already marked as ' + status, { theme: 'colored' });
            return;
        }
        setAttendanceMarkLoading(empId);
        try {
            const res = await markAttendance({ employeeId: empId, status, date: TODAY, returnType: 'simple' });
            const data = res.data;
            if (data.updatedAttendance.status === status) {
                toast.success('Attendance already marked as ' + status, { theme: 'dark' });

                setEmployees(prev =>
                    prev.map(emp =>
                        emp._id === empId
                            ? {
                                ...emp,
                                attendanceStatus: data.updatedAttendance.status,
                                totalUnpaidAmount: data.totalUnpaidAmount,
                                unpaidFullDays: data.unpaidFullDays,
                                unpaidHalfDays: data.unpaidHalfDays,
                                unpaidPartialAmount: data.unpaidPartialAmount,
                                paid: data.updatedAttendance.paid

                            } : emp

                    )
                )

            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error(error.response.data.error || 'Failed to mark attendance. Try again.', { theme: 'colored' });
        } finally {
            setTimeout(() => {
                setAttendanceMarkLoading('');
            }, 300);
        }
    };

    useEffect(() => {
        employeeListPage()
            .then(res => {setEmployees(res.data)})
            .catch(err => {
                console.error('Error while fetch employee list page:', err);
                toast.error(err.response?.data?.error || 'Failed to fetch employees. Try again.', { theme: 'colored' });
            })
        setLoading(false)
    }, []);

    if (loading) {
        return <Skeleton />
    }
    if (!loading && (!employees || employees.length === 0)) {
        return <NoData text={'No employees available'} />
    }


    return (
        <div className="p-1 max-w-3xl mx-auto w-full space-y-4 px-4">
            {/* heading */}
            <div className='flex flex-row items-baseline justify-between mb-4'>
                <h2 className="text-2xl font-bold mb-4">Employee List</h2>

                <p className="text-lg px-1.5 bg-accent/50 rounded-lg">{dayjs(TODAY).format('DD-MM-YYYY')}</p>
            </div>


            {/* employees list */}
            <ul className="space-y-4">
                {employees.map(emp => (

                    // single employee
                    <li key={emp._id} className="flex flex-col py-3 px-1.5 rounded-lg shadow-xl shadow-gray-400 gap-2 bg-background/50">

                        {/* employee name and salary */}
                        <div className='flex justify-end items-stretch gap-2 w-full'>
                            {/* employee name */}
                            <a
                                href={`/dashboard/time-based/${emp._id}`}
                                // onClick={()=>handleClick(`/employees/${emp._id}`)}
                                className='flex flex-row items-center gap-2 grow'
                            >
                                <div className='text-lg font-semibold  capitalize'>
                                    <p>{emp.name}<span className='text-xs font-normal'> {emp.job}</span></p>
                                    <p className='text-xs font-normal'>(₹{emp.salaryPerDay}/day)</p>
                                </div>

                            </a>

                            {/* days count */}
                            <div className="relative bg-primary/50 px-5 text-text p-1 rounded-md flex flex-col items-center">
                                <div className='flex items-center gap-2'>
                                    <p className='bg-green-500 size-5 rounded-full'></p>
                                    {emp.unpaidFullDays || 0}</div>

                                <div className='flex items-center gap-2 '>
                                    <p className='bg-half size-5 rounded-full'></p>
                                    {emp.unpaidHalfDays || 0}
                                </div>
                            </div>

                            {/* salary */}
                            <p className='bg-primary/50 px-5 rounded-md p-1 flex flex-col items-center justify-center'>
                                ₹{emp.totalUnpaidAmount || 0}
                            </p>
                        </div>

                        <div className='w-full flex justify-around items-center'>

                            {/* Show loading spinner when attendance is being marked */}
                            {attendanceMarkLoading === emp._id ? (
                                <p className={`w-full border rounded-md p-1 cursor-default text-center bg-slate-600 text-white`}>
                                    <MdAutorenew />
                                </p>
                            ) : emp.attendanceStatus && editId != emp._id ? (
                                // Show attendance status and edit icon
                                <div className='space-x-2 w-full flex items-center'>
                                    <p
                                        className={`w-full py-2 flex items-center justify-center space-x-1 border border-border rounded-md  cursor-default text-center capitalize ${emp.attendanceStatus === 'present'
                                            ? 'bg-green-600 text-white'
                                            : emp.attendanceStatus === 'absent'
                                                ? 'bg-red-600 text-white'
                                                : emp.attendanceStatus === 'half' && 'bg-yellow-500 text-black'
                                            }`}
                                    >
                                        <span>{emp.attendanceStatus}</span>
                                        {emp.paid && <span className=' text-black uppercase tracking-wide font-semibold'> [paid] </span>}

                                    </p>
                                    {!emp.paid && <MdEdit onClick={() => { setEditId(emp._id) }} className="text-2xl" />}

                                </div>
                            ) : (
                                <ol className='flex items-center justify-between w-full gap-2'>
                                    {editId === emp._id && <li><p>EDITING</p></li>}

                                    {['present', 'half', 'absent'].map(status => (
                                        <li
                                            key={status}
                                            className={`${editId === emp._id ? 'w-1/4' : 'w-[30%]'} h-8 border border-border rounded-md flex justify-center items-center cursor-pointer text-white ${status === 'present'
                                                ? 'bg-green-500'
                                                : status === 'half'
                                                    ? 'bg-yellow-500'
                                                    : status === 'absent' && 'bg-red-600'
                                                }`}
                                            onClick={() => handleAttendanceChange(emp._id, status)}
                                        >
                                            <span className="capitalize">{status}</span>
                                        </li>

                                    ))}
                                    {editId === emp._id && <MdClose onClick={() => { setEditId('') }} className="text-2xl" />}
                                </ol>
                            )}

                            {/* Edit employee button */}
                        </div>
                    </li>

                ))}
            </ul>

            {/* add employee button */}
            <Link href="/employees/add" className='block w-full'>
                <div className={` p-6 bg-accent/80 text-center text-lg rounded-2xl shadow-xl shadow-gray-400`}>
                    Add Employee +
                </div>
            </Link>

        </div>
    );
}