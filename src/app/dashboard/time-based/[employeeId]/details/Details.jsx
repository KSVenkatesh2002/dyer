import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import EmployeeCard from "./EmployeeCard";
import {
  FaMoneyBillWave,
  FaCoins,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

import "@/styles/transition.css";

export default function Details({
  employee,
  attendanceSummary,
  onEmployeeProfileUpdate,
  onClearHistory,
}) {
  const {
    totalUnpaidAmount,
    unpaidFullDays,
    unpaidHalfDays,
    totalFullDays,
    totalHalfDays,
    absentDaysTotal,
    totalPaidAmount,
    unpaidPartialAmount,
    advancePay,
  } = attendanceSummary;
  const [showMore, setShowMore] = useState(false);
  const nodeRef = useRef(null);

  // Helper for Stat Cards
  const StatCard = ({ label, value, color, icon: Icon, subValue }) => (
    <div
      className={`p-4 rounded-2xl border ${color} bg-white shadow-sm flex flex-col items-center justify-center text-center gap-1 min-h-[120px]`}
    >
      {Icon && <Icon className="text-2xl mb-1 opacity-80" />}
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </h3>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      {subValue && (
        <p className="text-xs font-semibold opacity-70">{subValue}</p>
      )}
    </div>
  );

  const AttendanceDetails = () => {
    return (
      <CSSTransition
        in={showMore}
        timeout={500}
        classNames="expand"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div className="overflow-hidden space-y-6 pt-4" ref={nodeRef}>
          {/* Important Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary to-yellow-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                <FaCoins className="text-9xl" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">
                Salary to Pay
              </h2>
              <p className="text-5xl font-black mt-2">₹{totalUnpaidAmount}</p>
              <p className="text-sm mt-1 opacity-80">Pending Dues</p>
            </div>

            <div className="bg-white border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 text-gray-900 transform translate-x-1/3 -translate-y-1/3">
                <FaCheckCircle className="text-9xl" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-text">
                Total Paid
              </h2>
              <p className="text-5xl font-black mt-2 text-green-600 flex items-baseline">
                <span className="text-2xl text-gray-400 mr-1">₹</span>
                {totalPaidAmount}
              </p>
              <p className="text-sm mt-1 text-gray-400">Lifetime Earnings</p>
            </div>
          </div>

          {/* Detailed Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              label="Pending Full Days"
              value={unpaidFullDays}
              color="border-blue-100 ring-4 ring-blue-50/50 text-blue-600"
            />
            <StatCard
              label="Pending Half Days"
              value={unpaidHalfDays}
              color="border-yellow-100 ring-4 ring-yellow-50/50 text-yellow-600"
            />
            <StatCard
              label="Advance Taken"
              value={`₹${advancePay}`}
              color="border-red-100 ring-4 ring-red-50/50 text-red-600"
            />
            <StatCard
              label="Total Full Days"
              value={totalFullDays}
              color="border-gray-200 text-gray-600"
            />
            <StatCard
              label="Total Half Days"
              value={totalHalfDays}
              color="border-gray-200 text-gray-600"
            />
            <StatCard
              label="Partial Pending"
              value={`₹${unpaidPartialAmount}`}
              color="border-orange-200 text-orange-600"
            />
          </div>
        </div>
      </CSSTransition>
    );
  };

  return (
    <div className="w-full space-y-6">
      <EmployeeCard
        employee={employee}
        onUpdate={onEmployeeProfileUpdate}
        onClearHistory={onClearHistory}
      />

      {/* Total Due Strip */}
      <div className="bg-secondary rounded-2xl p-1 flex items-center justify-between shadow-md text-white overflow-hidden">
        <div className="px-6 py-3 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">
            <FaExclamationCircle />
          </div>
          <div>
            <p className="text-xs text-white/60 font-bold uppercase tracking-wider">
              Current Due
            </p>
            <p className="text-2xl font-bold leading-none">
              ₹{totalUnpaidAmount}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className="h-full px-6 py-4 bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center gap-2 rounded-xl m-1 shadow-lg"
        >
          {showMore ? "Less" : "Details"}
          {showMore ? (
            <MdExpandLess className="text-lg" />
          ) : (
            <MdExpandMore className="text-lg" />
          )}
        </button>
      </div>

      {AttendanceDetails()}
    </div>
  );
}
