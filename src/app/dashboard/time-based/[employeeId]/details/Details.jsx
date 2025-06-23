import React, { useRef, useState, } from 'react'
import { CSSTransition } from "react-transition-group";
import EmployeeCard from './EmployeeCard';

import "@/styles/transition.css";

export default function Details({ employee, attendanceSummary, onEmployeeProfileUpdate, onClearHistory,  }) {
    const {
        totalUnpaidAmount,
        unpaidFullDays,
        unpaidHalfDays,
        totalFullDays,
        totalHalfDays,
        absentDaysTotal,
        totalPaidAmount,
        unpaidPartialAmount,
        advancePay,
    } = attendanceSummary;
    const [showMore, setShowMore] = useState(false)
    const nodeRef = useRef(null);
    
    const AttendanceDetails = () => {
        return (
            <CSSTransition
                in={showMore}
                timeout={500}
                classNames="expand"
                unmountOnExit
                nodeRef={nodeRef} // 👈 pass ref here
            >
                <div
                    className={`overflow-hidden max-w-6xl mx-auto p-2 space-y-8 text-slate-600 bg-gradient-to-br 
            from-accent to-secondary rounded-2xl`}
                    ref={nodeRef}
                >

                    {/* Important Summary */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Salary To Pay */}
                        <div className=" transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-xl">
                            <h2 className="text-xl font-semibold">Salary to Pay</h2>
                            <p className="text-4xl font-bold mt-2">₹{totalUnpaidAmount}</p>
                        </div>

                        {/* Total Paid */}
                        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-xl">
                            <h2 className="text-xl font-semibold">Total Paid</h2>
                            <p className="text-4xl font-bold mt-2">₹{totalPaidAmount}</p>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-3 gap-2">

                        {/* Unpaid Full Days */}
                        <div className="bg-green-100 p-2 rounded-xl border-2 border-blue-200 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-blue-700">Unpaid Full Days</h3>
                            <p className="text-3xl font-bold">{unpaidFullDays}</p>
                        </div>

                        {/* Unpaid Half Days */}
                        <div className="bg-white p-2 rounded-xl border-2 border-yellow-200 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-yellow-700">Unpaid Half Days</h3>
                            <p className="text-3xl font-bold">{unpaidHalfDays}</p>
                        </div>

                        {/* Advance Payment */}
                        <div className="bg-green-100 p-1 rounded-xl border-2 border-green-200 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-green-600">Advance Paid</h3>
                            <p className="text-3xl font-bold">₹{advancePay}</p>
                        </div>

                        {/* Full Days Total */}
                        <div className="bg-indigo-200 p-0.5 rounded-xl border-2 border-indigo-200 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-indigo-600">Full Days Total</h3>
                            <p className="text-3xl font-bold">{totalFullDays || 0}</p>
                        </div>

                        {/* Half Days Total */}
                        <div className="bg-indigo-200 p-0.5 rounded-xl border-2 border-indigo-200 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-indigo-600">Half Days Total</h3>
                            <p className="text-3xl font-bold">{totalHalfDays}</p>
                        </div>

                        {/* Partial Amount */}
                        <div className="bg-red-100 p-1 rounded-xl border-2 border-red-300 shadow-md text-center">
                            <h3 className="text-lg font-semibold text-red-700">Pending Amount</h3>
                            <p className="text-3xl font-bold">₹{unpaidPartialAmount}</p>
                        </div>

                    </div>

                </div>
            </CSSTransition>
        );
    }
    return (
        <div className='w-full flex flex-col justify-between gap-2 items-center '>
            <EmployeeCard
                employee={employee}
                onUpdate={onEmployeeProfileUpdate}
                onClearHistory={onClearHistory}
            />


            <div className='w-full flex justify-between bg-secondary text-black  rounded'>
                <div className='px-4 py-1'>
                    <p>Total Due</p>
                    <p className='text-red-600 font-black text-2xl'><span className='text-sm font-normal'>₹</span>{totalUnpaidAmount}</p>
                </div>
                <button onClick={() => setShowMore((prev) => !prev)} className='bg-accent text-text px-2 py-1 min-h-full rounded flex items-stretch shadow-lg shadow-slate-600'>
                    <span className='m-auto text-gray-900'>{showMore ? 'Show Less -' : 'Show More +'}</span>
                </button>

            </div>

            {AttendanceDetails()}

        </div>
    )
}
