"use client";
import React from "react";
import EmployeesByJob from "@/components/employees/EmployeeList";
import { FaUsersCog } from "react-icons/fa";

const workNameList = [
  { name: "chittam", type: "task-based" },
  { name: "asu-winding", type: "task-based" },
  { name: "asu-marking", type: "task-based" },
  { name: "tying", type: "time-based" },
  { name: "dyeing", type: "time-based" },
];

const page = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary/5 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-gray-200/50 mb-6 text-primary transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <FaUsersCog className="text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight">
            Employee <span className="text-primary">Directory</span>
          </h1>
          <p className="text-muted-text max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Access and manage all your employees categorized by their specific
            roles and departments in one place.
          </p>
        </div>

        <div className="space-y-6">
          {workNameList.map(({ name, type }) => (
            <EmployeesByJob key={name} job={name} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
