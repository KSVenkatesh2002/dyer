'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createProductWithTask, getAllClients } from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

// Icons
import { BiSolidTrafficCone } from "react-icons/bi";
import { GiNails, GiTakeMyMoney } from "react-icons/gi";
import { PiNumberEightLight, PiMapPinSimpleAreaFill } from "react-icons/pi";
import { MdOutlineRepeat, MdDriveFileRenameOutline } from "react-icons/md";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { LuTally5 } from "react-icons/lu";
import { IoIosPerson } from "react-icons/io";
import { RiLayout3Fill } from "react-icons/ri";

export default function AddProduct() {
    const params = useParams();
    const router = useRouter();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [vaatam, setVaatam] = useState(0);

    const [form, setForm] = useState({
        clientId: '',
        sariSection: 'body',
        nailsCount: '40',
        conesUsed: '50',
        kolukkulu: '4',
        varasalu: '4',
        repeat: '2',
        numberOfSarees: '20',
        designName: '',
        employeeId: params.employeeId,
        pays: '12',
    });

    useEffect(() => {
        getAllClients()
            .then((res) => setClients(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const { varasalu, kolukkulu, conesUsed, nailsCount, numberOfSarees } = form;
        const value = varasalu * kolukkulu * conesUsed * nailsCount / numberOfSarees;
        setVaatam(value);
    }, [form.varasalu, form.kolukkulu, form.conesUsed, form.nailsCount, form.numberOfSarees]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProductWithTask(form);
            toast.success('Product created & task assigned!');
            setIsOpen(true);
        } catch (err) {
            toast.error('Error submitting form');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const Popup = () => isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl text-center w-[90%] max-w-md space-y-4">
                <h2 className="text-xl font-bold">🎉 Task Assigned</h2>
                <p>Would you like to add another product to this same employee?</p>
                <div className="flex flex-col gap-3 sm:flex-row justify-center">
                    <button onClick={() => setIsOpen(false)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Yes, Add Another
                    </button>
                    <Link href={`/dashboard/task-based/${form.employeeId}`} className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">
                        Go to Dashboard
                    </Link>
                    <button onClick={() => router.back()} className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );

    const renderInput = (label, name, type = "number", Icon) => (
        <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Icon className={`text-lg ${ label === 'Kolukkulu' && 'rotate-90'}`} />
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded-md focus:outline-accent"
            />
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Create Product & Assign Winding Task</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                            <IoIosPerson /> Client
                        </label>
                        <select
                            name="clientId"
                            value={form.clientId}
                            onChange={handleChange}
                            required
                            className="border p-3 w-full rounded-md"
                        >
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                            <RiLayout3Fill /> Sari Section
                        </label>
                        <select
                            name="sariSection"
                            value={form.sariSection}
                            onChange={handleChange}
                            required
                            className="border p-3 w-full rounded-md"
                        >
                            <option value="body">Body</option>
                            <option value="pallu">Pallu</option>
                        </select>
                    </div>

                    {renderInput("Nails Count", "nailsCount", "number", GiNails)}
                    {renderInput("Cones Used", "conesUsed", "number", BiSolidTrafficCone)}
                    {renderInput("Kolukkulu", "kolukkulu", "number", PiNumberEightLight)}
                    {renderInput("Varasalu", "varasalu", "number", MdOutlineRepeat)}
                    {renderInput("Repeat", "repeat", "number", BsArrowCounterclockwise)}
                    {renderInput("Number of Sarees", "numberOfSarees", "number", LuTally5)}
                    {renderInput("Salary per Saree", "pays", "number", GiTakeMyMoney)}
                    {renderInput("Design Name", "designName", "text", MdDriveFileRenameOutline)}

                    {/* <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                            <MdDriveFileRenameOutline /> Design Name
                        </label>
                        <input
                            type="text"
                            name="designName"
                            value={form.designName}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-md"
                        />
                    </div> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p className="bg-background text-center text-gray-800 font-semibold p-3 rounded-md">
                        Vaatam: {vaatam.toFixed(2)}
                    </p>
                    <p className="bg-background text-center text-gray-800 font-semibold p-3 rounded-md">
                        Total Pay: ₹{form.pays * form.numberOfSarees}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md font-semibold ${loading ? 'bg-gray-400' : 'bg-accent text-white hover:bg-accent/90'}`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            <Popup />
        </>
    );
}
