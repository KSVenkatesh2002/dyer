'use client';

import { useEffect, useState } from 'react';
import { createEmployee } from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaCheck, FaTimes } from 'react-icons/fa';

const workTypes = ['tying', 'dyeing', 'asu-marking', 'asu-winding', 'chittam']; // Assuming this is the service to handle the API call

export default function AddEmployeePage() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        joinDate: '',
        address: '',
        job: '',
        salaryPerDay: '',
        workExperience: '',
        previousWorkPlace: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isTyingDyeing = form.job === 'tying' || form.job === 'dyeing';

    useEffect(()=>{
        setForm({ ...form, salaryPerDay: '' })
    },[isTyingDyeing])

    const togglePopup = () => setIsOpen(!isOpen);
    const closePopup = () => setIsOpen(false);

    const handleChange = (e) => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEmployee(form);
            toast.success('Employee added successfully!', { theme: 'dark' });

            setForm({
                name: '',
                phone: '',
                joinDate: new Date().toISOString().split('T')[0],
                address: '',
                job: '',
                salaryPerDay: '',
                workExperience: '',
                previousWorkPlace: '',
            });

            togglePopup();
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        }
        setLoading(false);
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
                    <p id="popupDesc">Would you like to add another employee?</p>

                    <div className="flex flex-col gap-3 sm:flex-row justify-center">
                        <button
                            onClick={closePopup}
                            className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2"
                        >
                            <FaCheck />
                            Yes, Add Another
                        </button>

                        <Link
                            href="/employees/attendance/tying-dyeing-workers"
                            replace
                            className="border border-mutedText text-mutedText hover:bg-mutedHover px-4 py-2 rounded-md flex items-center justify-center gap-2"
                        >
                            <FaTimes />
                            No, Go to List
                        </Link>
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
                    {/* Work Type */}
                    <label htmlFor="" className=' text-sm text-text capitalize'>job</label>
                    <select
                        name="job"
                        value={form.job}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md text-text"
                    >
                        <option value="">Select Job</option>
                        {workTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.replace('-', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>

                    {/* Common Fields */}
                    <label htmlFor="" className=' text-sm text-text capitalize'>Username</label>
                    <input
                        name="name"
                        // placeholder="Name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText"
                    />
                    <label htmlFor="" className=' text-sm text-text capitalize'>phone</label>
                    <input
                        name="phone"
                        // placeholder="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />
                    <label htmlFor="" className=' text-sm text-text capitalize'>join date</label>
                    <input
                        name="joinDate"
                        type="date"
                        value={form.joinDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />
                    <label htmlFor="" className=' text-sm text-text capitalize'>address</label>
                    <input
                        name="address"
                        // placeholder="Address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />

                    {/* Optional Fields */}
                    <label htmlFor="" className=' text-sm text-text capitalize'>work experience</label>
                    <input
                        name="workExperience"
                        placeholder="(optional)"
                        type="text"
                        value={form.workExperience}
                        onChange={handleChange}
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />
                    <label htmlFor="" className=' text-sm text-text capitalize'>previous work place</label>
                    <input
                        name="previousWorkPlace"
                        placeholder="(optional)"
                        type="text"
                        value={form.previousWorkPlace}
                        onChange={handleChange}
                        className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                    />

                    {/* Conditional Field: Only for Tying / Dyeing */}
                    {isTyingDyeing && (<>
                        <label htmlFor="" className=' text-sm text-text capitalize'>salary per day</label>
                        <input
                            name="salaryPerDay"
                            type="number"
                            // placeholder="Salary per day"  setForm({ ...form, salaryPerDay: '' })
                            value={form.salaryPerDay}
                            onChange={handleChange}
                            required
                            className="w-full bg-surface border p-3 rounded-md placeholder-mutedText text-text"
                        />
                    </>)}

                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-disabled' : 'bg-primary'} transition-colors p-3 rounded-md text-white font-semibold`}
                    >
                        {loading ? 'Loading...' : 'Save'}
                    </button>
                </form>
                <PopUp />
            </div>
        </div>
    );
}

