import React from "react";
import Link from "next/link";
import { FaMoneyBillWave, FaHistory } from "react-icons/fa";

const PaymentNavButton = ({ employeeId, job }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <Link
        href={`/payments/add/${job}/${employeeId}`}
        className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all"
      >
        <FaMoneyBillWave />
        Add New Payment
      </Link>
      <Link
        href={`/payments/history/time-based/${employeeId}`}
        className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-text-dark font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
      >
        <FaHistory className="text-muted-text" />
        Show Payment History
      </Link>
    </div>
  );
};

export default PaymentNavButton;
