'use client';

import { useState } from 'react';
import { createClient } from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AddClientPage() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => setIsOpen(!isOpen);
    const closePopup = () => setIsOpen(false);

    const router = useRouter();

    const handleChange = (e) => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createClient(form);
            toast.success('Employee added successfully!', { theme: 'dark' });

            setForm({
                name: '',
                phone: '',
                address: '',
                notes: '',
            });

            togglePopup();
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const PopUp = () => {
        return isOpen && (
            <div className="fixed inset-0 bg-gray-800/60 flex justify-center items-center z-50">

                <div
                    className="bg-surface p-6 rounded-xl text-center max-w-sm mx-auto space-y-4 shadow-lg text-text"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="popupTitle"
                    aria-describedby="popupDesc"
                >
                    <h2 id="popupTitle" className="text-xl font-bold text-text">🎉 Employee Added</h2>
                    <p id="popupDesc">Would you like to add another client?</p>

                    <div className="flex flex-col gap-3 sm:flex-row justify-center">
                        <button
                            onClick={closePopup}
                            className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2"
                        >
                            <FaCheck />
                            Yes
                        </button>

                        <button
                            // href="/"
                            onClick={() => router.back()}
                            className="border border-mutedText text-mutedText hover:bg-mutedHover px-4 py-2 rounded-md flex items-center justify-center gap-2"
                        >
                            <FaTimes />
                            No, Go back
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="p-6 max-w-xl w-full space-y-4 text-text rounded-lg bg-surface shadow-lg">
                <h2 className="text-2xl font-bold text-center">Add Employee</h2>
                {error && <p className="text-error text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">


                    {/* Common Fields */}
                    <label htmlFor="name" className=' text-sm text-text capitalize'>Username</label>
                    <input
                        name="name"
                        // placeholder="Name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText"
                    />
                    <label htmlFor="phone" className=' text-sm text-text capitalize'>phone</label>
                    <input
                        name="phone"
                        // placeholder="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />
                    <label htmlFor="address" className='text-sm text-text capitalize'>address</label>
                    <input
                        name="address"
                        // placeholder="Address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />
                    <label htmlFor="notes" className=' text-sm text-text capitalize'>notes</label>
                    <input
                        name="notes"
                        // placeholder="(optional)"
                        type="text"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />

                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-disabled' : 'bg-primary'} transition-colors p-3 rounded-md text-white font-semibold`}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'add client'}
                    </button>
                </form>
                <PopUp />
            </div>
        </div>
    );
}

