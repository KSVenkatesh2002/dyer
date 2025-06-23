import { useState, useEffect } from "react";
import {
    MdPhone,
    MdAttachMoney,
    MdCalendarToday,
    MdMenu,
    MdClose,
    MdEditNote,
    MdSave,
    MdDeleteForever,
    MdHistoryEdu,
} from 'react-icons/md';
import { GrUserWorker } from "react-icons/gr";

import { toast } from 'react-toastify';
import { deleteEmployee } from '@/lib/api'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';


export default function EmployeeCard({ employee, onUpdate, onClearHistory }) {
    const [showActions, setShowActions] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    // Detect screen size to enable proper behavior
    useEffect(() => {
        console.log('employee', employee)
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const [form, setForm] = useState({
        name: employee.name,
        phone: employee.phone,
        salaryPerDay: employee.salaryPerDay,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await onUpdate(form); // Pass edited data to parent (API call or state update)
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            name: employee.name,
            phone: employee.phone,
            salaryPerDay: employee.salaryPerDay,
        });
        setIsEditing(false);
    };

    const handleClearHistory = async () => {
        if (window.confirm("Are you sure you want to clear the attendance history?")) {
            await onClearHistory(employee.employeeId); 
        }
    }

    const router = useRouter();

    const handleDeleteEmployee = async (employeeId) => {
        console.log('deleteEmployee', employeeId);
        try {
            await deleteEmployee({employeeId, workType:'time-based'});
            toast.success('Employee deleted successfully!', { theme: 'light' });

            // Navigate to employee list page without pushing to history
            router.replace('/'); // <-- Replace with your actual route

        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting employee', { theme: 'light' });
            setError(err.response?.data?.message || 'Error deleting employee');
        }
    };

    const ActionTools = () =>
        <div className="w-full max-w-4xl px-2 mt-6 flex flex-col sm:flex-row justify-center sm:justify-between gap-3">
            <button
                onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                }}
                className="flex items-center gap-2 justify-center bg-surface px-4 py-2 rounded-xl shadow hover:bg-primary transition"
            >
                <MdEditNote className="text-xl" />
                Edit Profile
            </button>

            <button
                onClick={() => {
                    setShowActions(false);
                    handleClearHistory();
                }}
                className="flex items-center gap-2 justify-center bg-accent text-gray-200 px-4 py-2 rounded-xl shadow hover:bg-accentDark transition">
                <MdHistoryEdu className="text-xl" />
                Clear History
            </button>

            <button
                onClick={() => {
                    setShowActions(false);
                    handleDeleteEmployee(employee.employeeId);
                }}
                className="flex items-center gap-2 justify-center bg-[#c7522a] text-white px-4 py-2 rounded-xl shadow hover:brightness-110 transition">
                <MdDeleteForever className="text-xl" />
                Delete Employee
            </button>
        </div>

    return (
        <div className={`w-full mx-auto bg-gradient-to-br from-primary/20 to-primary/70 ${isEditing && 'shadow-2xl'} rounded-2xl p-6 relative`}>
            {/* Toggle Button for Mobile */}
            {isMobile &&
                !isEditing &&
                (
                    <button
                        className="absolute top-4 right-4 text-accent"
                        onClick={() => setShowActions(prev => !prev)}
                    >
                        {showActions ? <MdClose size={28} /> : <	MdMenu size={28} />}
                    </button>
                )}


            {!showActions && (<>
                <div className="text-center mb-4">
                    {isEditing ? (
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="text-center w-full text-2xl font-bold tracking-wide uppercase bg-transparent border-b border-accent focus:outline-none"
                        />
                    ) : (
                        <h2 className="text-2xl font-bold tracking-wide uppercase">{employee.name}</h2>
                    )}
                    <p className="text-sm text-text">Employee Overview</p>
                </div>


                <div className="space-y-4">
                    {!isEditing ? (<>
                        <div className="flex items-center space-x-3">
                            <MdPhone className="text-green-600" size={20} />
                            <span className="">{employee.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MdAttachMoney className="text-yellow-700" size={20} />
                            <span className="">₹ {employee.salaryPerDay} / day</span>
                        </div>
                    </>) : (<>
                        <div className="flex items-center space-x-3">
                            <MdPhone className="text-green-600" size={20} />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="bg-surface rounded px-3 py-1 text-text/70 border border-accent focus:outline-none w-full"
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <MdAttachMoney className="text-yellow-700" size={20} />
                            <input
                                name="salaryPerDay"
                                value={form.salaryPerDay}
                                onChange={handleChange}
                                type="number"
                                className="bg-surface rounded px-3 py-1 text-text/70 border border-accent focus:outline-none w-full"
                            />
                        </div>
                    </>)}

                    <div className="flex items-center space-x-3">
                        <MdCalendarToday className="text-red-800" size={20} />
                        <span className="">
                            Joined on:{" "}
                            {new Date(employee.joinDate).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <GrUserWorker className="text-blue-900" size={20} />
                        Work Type: 
                        <span className="ml-1 uppercase">
                            {employee.job}
                        </span>
                    </div>
                </div>



                <div className="w-full max-w-4xl px-2 mt-6 flex flex-wrap justify-center sm:justify-between gap-3">
                    {isEditing && (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 justify-center bg-[#74a892] text-white px-4 py-2 rounded-xl shadow hover:brightness-110 transition"
                            >
                                <MdSave className="text-xl" />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 justify-center bg-[#c7522a] text-white px-4 py-2 rounded-xl shadow hover:brightness-110 transition"
                            >
                                <MdClose className="text-xl" />
                                Cancel
                            </button>
                        </>
                    )}
                </div></>
            )}
            {/* Show Actions if not editing or on mobile */}
            {/* Action Buttons */}
            {(showActions || !isMobile) && !isEditing && (
                <ActionTools />
            )}

        </div>
    );
};
