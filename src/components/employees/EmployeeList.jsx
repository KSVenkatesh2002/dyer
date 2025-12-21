"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getEmployeesListByJob } from "@/lib/api";
import { FaUsers, FaArrowRight, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function EmployeesByJob({ job, type }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!job) return;

    const fetchEmployees = async () => {
      try {
        const res = await getEmployeesListByJob(job);
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [job]);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden mb-8 transition-all hover:shadow-2xl hover:shadow-primary/5">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm transform transition-transform hover:scale-105 hover:rotate-3">
            <FaUsers className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 capitalize tracking-tight leading-none">
              {job.replace(/-/g, " ")}
            </h2>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mt-1 block">
              Team Members
            </span>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              loading ? "bg-yellow-400 animate-pulse" : "bg-green-500"
            }`}
          ></span>
          {loading ? "Syncing..." : `${employees.length} Active`}
        </div>
      </div>

      <div className="p-6 bg-white/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
            <AiOutlineLoading3Quarters className="text-3xl animate-spin text-primary/50" />
            <p className="font-medium text-sm">Loading team members...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FaUsers className="text-2xl opacity-50" />
            </div>
            <p className="text-gray-500 font-medium">
              No employees found in this team.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Add new employees to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((emp) => (
              <Link
                key={emp._id}
                href={`/dashboard/${type}/${emp._id}`}
                className="group relative p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/0 group-hover:to-primary/5 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:from-primary/10" />

                <div className="flex items-center gap-4 relative z-10 w-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-primary/30">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors capitalize truncate pr-2">
                      {emp.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <FaIdBadge className="text-primary/70" />
                      {emp._id.slice(-6)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-primary/20 group-hover:text-primary transition-all transform group-hover:translate-x-1 shadow-sm">
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
