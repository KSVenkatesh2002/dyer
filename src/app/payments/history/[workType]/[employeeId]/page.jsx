'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPaymentRecord } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function PaymentRecordPage() {
    const params = useParams()
    const { employeeId, workType } = params
    const [loading, setLoading] = useState(true)
    const [paymentRecord, setPaymentRecord] = useState([])
    //0: amountPaid: 400
    //   beforeAmountPaid: 1050
    //   employeeId: "683887d3c89bd435bab3c6d5"
    //   method:  "cash"
    //   note: ""
    //   paidAt: "2025-05-29T17:42:00.000Z"
    //   paidDates: Array(1) 
    //      0: "Mon May 05 2025 05:30:00 GMT+0530 (India Standard Time)"
    //      1: "Mon May 06 2025 05:30:00 GMT+0530 (India Standard Time)"



    useEffect(() => {
        async function fetchPaymentHistory() {
            try {
                const res = await getPaymentRecord({ employeeId, workType });
                const records = Array.isArray(res.data) ? res.data : []; // ensures it's an array
                console.log('Fetched payment records:', records);
                setPaymentRecord(records);

            } catch (err) {
                console.log('================================');
                console.error(err);
                console.log('================================');
                toast.error(err.response.data.message || 'Failed to fetch payment records');
            } finally {
                setLoading(false)
            }
        };
        fetchPaymentHistory();

    }, []);

    const groupedByMonth =
        paymentRecord.reduce((acc, payment) => {
            const date = new Date(payment.paidAt);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) acc[monthYear] = [];
            acc[monthYear].push(payment);
            return acc;
        }, {});
    // }, [paymentRecord])

    return (
        <div className="w-full max-w-4xl sm:px-0 h-full min-h-[calc(100vh-64px)] p-4">
            <div className="w-full max-w-5xl min-h-[calc(100vh-64px)] sm:p-4 space-y-6">
                {!loading && (!paymentRecord || paymentRecord.length) === 0 ?
                    <div className="w-auto bg-secondary p-10 m-10 text-xl border border-border shadow-md rounded-xl text-center text-mutedText self-center">
                        No payment history available.
                    </div> :

                    <>
                        <div className="grid grid-cols-5 text-text bg-background dark:bg-dark.surface rounded-xl overflow-hidden shadow border border-border dark:border-dark.border">
                            <div className="col-span-3 bg-secondaryLight dark:bg-dark.surface p-3 font-semibold dark:text-dark.text border-r border-accent dark:border-dark.border">Payments</div>
                            {workType === 'time-based' && <div className="bg-secondaryLight dark:bg-dark.surface p-3 font-semibold dark:text-dark.text border-r border-accent dark:border-dark.border">Paid Dates</div>}
                            <div className="bg-secondaryLight dark:bg-dark.surface p-3 font-semibold dark:text-dark.text">Due / Paid</div>
                        </div>
                        {loading ? <>
                            <span className='bg-gray-500 p-5 w-30 rounded-xl block'></span>
                            <div className="w-auto bg-secondary/60 p-12 text-xl rounded-xl text-center text-mutedText self-center">
                            </div> 
                            <div className="w-auto bg-secondary/60 p-12 text-xl rounded-xl text-center text-mutedText self-center">
                            </div>
                            <div className="w-auto bg-secondary/60 p-12 text-xl rounded-xl text-center text-mutedText self-center">
                            </div>
                            </>: <>
                                {
                                    Object.entries(groupedByMonth).map(([monthYear, records]) => (
                                        <div key={monthYear}>
                                            <h2 className="text-lg font-semibold text-text dark:text-dark.text mb-2">{monthYear}</h2>
                                            <div className="grid grid-cols-1 gap-4">

                                                {records.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)).map((payment, idx) => (
                                                    <div key={idx} className="grid grid-cols-5 bg-secondary/60 rounded-xl overflow-hidden shadow-gray-500 shadow-lg">
                                                        {/* Payments */}
                                                        <div className="p-3 space-y-1 text-sm col-span-3 text-text dark:text-dark.text ">
                                                            <div className="font-medium">{new Date(payment.paidAt).toLocaleDateString()}</div>
                                                            <div> <span className="text-text/50">Method</span>: {payment.method}</div>
                                                            {payment.note && <div className="italic text-mutedText dark:text-dark.text"> <span className="text-text/50">Note</span>: {payment.note}</div>}
                                                        </div>
                                                        {/* Paid Dates */}
                                                        {workType === 'time-based' && <div className="text-center py-4 max-h-28 overflow-y-auto text-sm  text-text dark:text-dark.text border-l border-border dark:border-dark.border no-scrollbar">
                                                            {payment.paidDates?.map((date, i) => (
                                                                <div key={i}>{new Date(date).toLocaleDateString()}</div>
                                                            ))}
                                                        </div>}
                                                        {/* Due / Paid */}
                                                        <div className="p-3 text-sm text-text dark:text-dark.text border-l border-border dark:border-dark.border">
                                                            <span className="font-medium text-red-500"> ₹{payment.beforeAmountPaid}</span> /
                                                            <div className="font-medium text-lg text-green-500"> ₹{payment.amountPaid}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </>}
                    </>
                }
            </div>
        </div>
    );
}
