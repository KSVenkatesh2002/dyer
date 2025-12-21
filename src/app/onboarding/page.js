"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaInfoCircle,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await completeOnboarding(formData);
      await user?.reload();
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-black text-secondary">Dyer Handloom</h1>
          <p className="text-muted-text">
            Let&apos;s set up your digital workspace.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Complete Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your organization details below.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6 flex items-center gap-2 animate-pulse">
              <FaInfoCircle /> {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <InputGroup
              label="Company Name"
              name="companyName"
              placeholder="e.g. Laxmi Handlooms"
              icon={FaBuilding}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Location"
                name="location"
                placeholder="City, State"
                icon={FaMapMarkerAlt}
              />
              <InputGroup
                label="Start Date"
                name="startDate"
                type="date"
                icon={FaCalendarAlt}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 font-medium text-gray-700 placeholder:text-gray-400 resize-none"
                placeholder="Tell us briefly about your workshop..."
              />
            </div>

            <InputGroup
              label="Owners List"
              name="owners"
              placeholder="e.g. John Doe, Jane Doe"
              icon={FaUserTie}
            />

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
                  Setting up...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  required = true,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
          <Icon />
        </div>
      )}
      <input
        type={type}
        name={name}
        required={required}
        className={`w-full ${
          Icon ? "pl-11" : "pl-4"
        } pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 font-medium text-gray-700 placeholder:text-gray-400`}
        placeholder={placeholder}
      />
    </div>
  </div>
);
