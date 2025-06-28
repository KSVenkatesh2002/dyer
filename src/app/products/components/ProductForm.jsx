'use client';
import { useEffect, useMemo, useState } from 'react';
import { getAllClients } from '@/lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import icons...
import { BiSolidTrafficCone } from "react-icons/bi";
import { GiNails, GiTakeMyMoney } from "react-icons/gi";
import { PiNumberEightLight, PiMapPinSimpleAreaFill } from "react-icons/pi";
import { MdOutlineRepeat, MdDriveFileRenameOutline } from "react-icons/md";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { LuTally5 } from "react-icons/lu";
import { IoIosPerson } from "react-icons/io";
import { RiLayout3Fill } from "react-icons/ri";

export default function ProductForm({
    onSubmit,
    initialValues = {},
    hidePays = false,
    showPopup = false,
    employeeId = ''
}) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const [clientLoading, setClientLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productId, setProductId] = useState(false);
    const [form, setForm] = useState({
        clientId: '',
        sariSection: 'body',
        // measurements
        nailsCount: 0,
        conesUsed: 0,
        kolukkulu: 0,
        varasalu: 0,
        repeat: 0,
        sareesCount: 0,
        // design info
        designName: '',
        repeatType: 'Airplane',
        borderInches: '4',
        pays: 0,
        ...initialValues,
    });

    useEffect(() => {
        getAllClients()
            .then(res => {
                setForm(prev => ({ ...prev, clientId: res.data[0]._id })
                )
                setClients(res.data)
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error || 'Error fetching client list');
                console.error(error)
            })
            .finally(setClientLoading(false));
    }, []);
    const vaatam = useMemo(() => {
        const {
            varasalu,
            kolukkulu,
            conesUsed,
            nailsCount,
            sareesCount,
        } = form;

        // Convert string inputs to numbers to avoid NaN
        const v = Number(varasalu);
        const k = Number(kolukkulu);
        const c = Number(conesUsed);
        const n = Number(nailsCount);
        const s = Number(sareesCount);

        // Prevent division by zero
        if (s === 0) return 0;

        return (v * k * c * n) / s;
    }, [
        form.varasalu,
        form.kolukkulu,
        form.conesUsed,
        form.nailsCount,
        form.sareesCount,
    ]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            setProductId(await onSubmit(form))
            if (showPopup) setIsOpen(true); // Only show popup if enabled
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Error submitting form');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderHeadLine = (name) => (
        <p className='col-span-full font-bold text-lg mt-5'>{name}</p>
    );
    const renderInput = (label, name, type = "number", Icon = '') => (
        <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700 capitalize">
                {Icon !== '' && <>
                    < Icon className={`text-lg ${label === 'Kolukkulu' && 'rotate-90'}`} />
                </>}
                {label}

            </label>
            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="border p-2 w-full rounded-md focus:outline-accent"
            />
        </div>
    );
    const Popup = ({ onClose, employeeId }) => (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl text-center w-[90%] max-w-md space-y-4">
                <h2 className="text-xl font-bold">🎉 Task Assigned</h2>
                <h2 className="text-xl font-bold">Product Id : {productId}</h2>
                <p>Would you like to add another product to this same employee?</p>
                <div className="flex flex-col gap-3 sm:flex-row justify-center">
                    <button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Yes, Add Another
                    </button>
                    {employeeId !== '' && <Link
                        href={`/dashboard/task-based/${employeeId}`}
                        replace
                        className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                    >
                        Go to Dashboard
                    </Link>}

                    <button onClick={() => router.back()} className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">
                        {'<--'}Go Back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <h1 className="text-2xl font-bold mb-4 bg-secondary/40 rounded-lg w-full text-center p-2 ">Create Product</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {renderHeadLine('Product info')}
                    <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                            <IoIosPerson /> Client
                        </label>
                        {clientLoading
                            ? <p className='border p-3 w-full rounded-md text-center bg-black text-white'> Loading...</p>
                            : <select name="clientId" value={form.clientId} onChange={handleChange} required className="border p-3 w-full rounded-md">
                                {/* <option value="">Select Client</option> */}
                                {clients.map((client, ind) => (
                                    <option key={client._id} value={client._id}>{ind + 1}{' : '}{client.name}</option>
                                ))}
                            </select>}

                    </div>
                    <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                            <RiLayout3Fill /> Sari Section
                        </label>
                        <select name="sariSection" value={form.sariSection} onChange={handleChange} required className="border p-3 w-full rounded-md">
                            <option value="body">Body</option>
                            <option value="pallu">Pallu</option>
                        </select>
                    </div>
                    {renderHeadLine('Measurements')}
                    {renderInput("Nails Count", "nailsCount", "number", GiNails)}
                    {renderInput("Cones Used", "conesUsed", "number", BiSolidTrafficCone)}
                    {renderInput("Kolukkulu", "kolukkulu", "number", PiNumberEightLight)}
                    {renderInput("Varasalu", "varasalu", "number", MdOutlineRepeat)}
                    {renderInput("Repeat Times", "repeat", "number", BsArrowCounterclockwise)}
                    {renderInput("Sarees Count", "sareesCount", "number", LuTally5)}
                    <div className="col-span-full grid grid-cols-2 gap-4">
                        <p className="bg-background text-center text-gray-800 font-semibold p-3 rounded-md">Vaatam: {vaatam.toFixed(2)}</p>
                        {/* {!hidePays && <p className="bg-background text-center text-gray-800 font-semibold p-3 rounded-md">Total Pay: ₹{form.pays * form.sareesCount * form.repeat}</p>} */}
                    </div>
                    {!hidePays && renderInput("pays", "pays", "number", GiTakeMyMoney)}
                    {renderHeadLine('Design info')}
                    {renderInput("Design Name", "designName", "text", MdDriveFileRenameOutline)}
                    <div>
                        <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700 capitalize">
                            repeat type
                        </label>
                        <select name="repeatType" value={form.repeatType} onChange={handleChange} className="border p-3 w-full rounded-md">
                            <option value="body">Airplane</option>
                            <option value="pallu">Raan Boone</option>
                        </select>
                    </div>
                    {renderInput("border inches", "borderInches", "text")}
                </div>


                <button type="submit" disabled={loading} className={`w-full py-2 rounded-md font-semibold border-2 ${loading 
                    ? 'border-accent text-accent' 
                    : 'border-accent text-white bg-accent'}`}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {isOpen && <Popup onClose={() => setIsOpen(false)} employeeId={employeeId} />}
        </>
    );
}