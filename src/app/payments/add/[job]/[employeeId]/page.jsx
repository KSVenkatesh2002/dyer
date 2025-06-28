'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { addPayment } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Payment() {
    const params = useParams()
    const { job, employeeId } = params
    const router = useRouter()
    const [formData, setFormData] = useState({
        amountPaid: '',
        method: 'cash',
        paidFor: 'salary',
        paidAt: '',
        note: '',
    });
    const [loading, setLoading] = useState(false)
    //0: amountPaid: 400
    //   beforeAmountPaid: 1050
    //   employeeId: "683887d3c89bd435bab3c6d5"
    //   method:  "cash"
    //   note: ""
    //   paidAt: "2025-05-29T17:42:00.000Z" 
    //   paidDates: Array(1) only for time-based job
    //      0: "Mon May 05 2025 05:30:00 GMT+0530 (India Standard Time)"
    //      1: "Mon May 06 2025 05:30:00 GMT+0530 (India Standard Time)"

    useEffect(() => {
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        setFormData((prev) => ({ ...prev, paidAt: localISO }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const numericAmount = Number(formData.amountPaid);

            if (!formData.amountPaid || isNaN(numericAmount) || numericAmount <= 0) {
                return toast.error('Please enter a valid amount');
            }

            if (isNaN(new Date(formData.paidAt))) {
                return toast.error('Please enter a valid date and time');
            }
            await addPayment({ data: { ...formData, amountPaid: numericAmount, employeeId }, job })

            toast.success('Payment Added Successfully', { theme: 'colored' });

            setFormData((prev) => ({
                ...prev,
                amountPaid: '',
                method: 'cash',
                paidFor: 'salary',
                note: '',
            }));
            router.back()
        } catch (error) {
            console.error(error);
            toast.error( error?.response?.data?.error || 'Failed to record payment');
        } finally {
            setLoading(false)
        }
    };



    return (
        <div className="w-full max-w-4xl px-2 sm:px-0 flex justify-center items-center min-h-[calc(100vh-64px)]">
            <form
                onSubmit={handleSubmit}
                className="space-y-5 mt-6 w-full mx-auto p-6  rounded-2xl shadow-md shadow-gray-400 relative"
            >
                <h2 className="text-2xl font-semibold capitalize">Enter Payment Record Details</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                        type="text"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setFormData(prev => ({ ...prev, amountPaid: value }));
                            }
                        }}
                        required
                        inputMode="numeric"
                        className="w-full p-3 rounded-lg border border-border  text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Method</label>
                    <select
                        name="method"
                        value={formData.method}
                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg border border-border  text--gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">paid for</label>
                    <select
                        name="paidFor"
                        value={formData.paidFor}
                        onChange={(e) => setFormData({ ...formData, paidFor: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg border border-border  text--gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="salary">salary</option>
                        <option value="bonus">bonus</option>
                        <option value="advance">advance</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Paid At</label>
                    <input
                        type="datetime-local"
                        name="paidAt"
                        value={formData.paidAt}
                        onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg border border-border text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text mb-1">Note</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full p-3 rounded-lg border border-border text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 px-6 ${loading ? 'bg-gray-300 border-2 text-disabled' : 'bg-accent hover:cursor-pointer'}  font-semibold rounded-lg transition duration-200`}
                    disabled={loading}
                >
                    Add Payment
                </button>
            </form>
        </div>
    );
}
