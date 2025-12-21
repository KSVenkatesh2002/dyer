"use client";

import { useEffect, useState } from "react";
import { createEmployee } from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdWork, MDBadge } from "react-icons/md";
import { cn } from "@/lib/utilty/cn";

const workTypes = ["tying", "dyeing", "asu-marking", "asu-winding", "chittam"];

export default function AddEmployeePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    joinDate: "",
    address: "",
    job: "",
    salaryPerDay: "",
    workExperience: "",
    previousWorkPlace: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isTyingDyeing = form.job === "tying" || form.job === "dyeing";

  useEffect(() => {
    if (!isTyingDyeing) {
      setForm((prev) => ({ ...prev, salaryPerDay: "" }));
    }
  }, [isTyingDyeing]);

  const togglePopup = () => setIsOpen(!isOpen);
  const closePopup = () => setIsOpen(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEmployee(form);
      // Removed toast here since we show a modal
      // toast.success('Employee added successfully!', { theme: 'dark' });

      setForm({
        name: "",
        phone: "",
        joinDate: new Date().toISOString().split("T")[0],
        address: "",
        job: "",
        salaryPerDay: "",
        workExperience: "",
        previousWorkPlace: "",
      });

      setIsOpen(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
      toast.error(
        err.response?.data?.error || "An error occurred. Please try again.",
        { theme: "colored" }
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-full md:py-8 md:px-4 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-secondary p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Add New Employee
            </h1>
            <p className="text-white/70">
              Enter details to register a new worker
            </p>
          </div>
          <div className="hidden sm:block p-4 bg-white/10 rounded-2xl">
            <FaUser className="text-4xl text-white/90" />
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
            <FaTimes className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Job Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
              <MdWork className="text-primary" /> Job Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 capitalize">
                  Job Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="job"
                  value={form.job}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select Job Role</option>
                  {workTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {isTyingDyeing && (
                <InputGroup
                  label="Salary Per Day"
                  name="salaryPerDay"
                  type="number"
                  value={form.salaryPerDay}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500"
                  icon={FaMoneyBillWave}
                  className="animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>
          </section>

          {/* Section 2: Personal Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
              <FaUser className="text-primary" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                icon={FaUser}
              />
              <InputGroup
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 9876543210"
                icon={FaPhone}
              />
              <InputGroup
                label="Joining Date"
                name="joinDate"
                type="date"
                value={form.joinDate}
                onChange={handleChange}
                required
                icon={FaCalendarAlt}
              />
              <InputGroup
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Full Address"
                icon={FaMapMarkerAlt}
              />
            </div>
          </section>

          {/* Section 3: Experience (Optional) */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
              <FaBriefcase className="text-primary" /> Experience (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Years of Experience"
                name="workExperience"
                value={form.workExperience}
                onChange={handleChange}
                placeholder="e.g. 2 years"
              />
              <InputGroup
                label="Previous Workplace"
                name="previousWorkPlace"
                value={form.previousWorkPlace}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0",
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 hover:shadow-primary/30"
              )}
            >
              {loading ? "Saving Employee..." : "Create Employee Profile"}
            </button>
          </div>
        </form>
      </div>
      <PopUp isOpen={isOpen}/>
    </div>
  );
}

const PopUp = ({isOpen}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white p-8 rounded-2xl text-center max-w-md w-full space-y-6 shadow-2xl transform scale-100 transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-4xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600">
            Employee has been successfully added to the system.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={closePopup}
            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <FaCheck />
            Add Another Employee
          </button>

          <Link
            href="/employees/list"
            replace
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            View Employees List
          </Link>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  icon: Icon,
  placeholder,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    <label className="text-sm font-semibold text-gray-700 capitalize flex items-center gap-2">
      {Icon && <Icon className="text-primary/70" />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
    />
  </div>
);
