"use client";

import { useState } from "react";
import { createClient } from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AddClientPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient(form);
      // toast.success('Client added successfully!');
      setForm({
        name: "",
        phone: "",
        address: "",
        notes: "",
      });
      setIsOpen(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
      toast.error(err.response?.data?.error || "Failed to add client");
    } finally {
      setLoading(false);
    }
  };

  const InputGroup = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    required = false,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 capitalize flex items-center gap-2">
        {Icon && <Icon className="text-lg text-primary" />}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
        />
      </div>
    </div>
  );

  const PopUp = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <FaCheckCircle className="text-3xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Client Added!
          </h2>
          <p className="text-gray-500">
            The new client has been successfully registered.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all"
          >
            Add Another Client
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            Go Back to List
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary/5 py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-gray-400 hover:text-secondary hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hidden sm:block"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-black text-secondary mb-2">
            Add Client
          </h1>
          <p className="text-muted-text">
            Register a new client using the form below.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-white/50 space-y-8">
          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputGroup
              label="Client Name"
              name="name"
              placeholder="e.g. Silk House"
              icon={FaUser}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                icon={FaPhone}
                required
              />
              <InputGroup
                label="Address"
                name="address"
                placeholder="City, Area"
                icon={FaMapMarkerAlt}
                required
              />
            </div>

            <InputGroup
              label="Notes (Optional)"
              name="notes"
              placeholder="Authorized person, GST number, etc."
              icon={FaStickyNote}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 hover:shadow-primary/30"
                }`}
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Adding Client...
                  </>
                ) : (
                  "Add Client"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isOpen && <PopUp />}
    </div>
  );
}
