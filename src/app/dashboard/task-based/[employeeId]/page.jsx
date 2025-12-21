"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getEmployeeDetailsById,
  getTasks,
  paymentSummary,
  removeTask,
} from "@/lib/api";
import Link from "next/link";
import NoData from "@/components/NoData";
import { ProductList } from "@/components/productList";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdPayment, MdHistory } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function WindingEmployeeDashboard() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [empRes, taskRes, sumRes] = await Promise.all([
          getEmployeeDetailsById(employeeId),
          getTasks(employeeId),
          paymentSummary(employeeId),
        ]);
        setEmployee(empRes.data);
        setTasks(taskRes.data);
        setSummary(sumRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId]);

  const handleRemoveTask = async (taskId) => {
    try {
      await removeTask({ taskId, job: employee.job });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task removed");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to remove task");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center bg-secondary/5 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <AiOutlineLoading3Quarters className="animate-spin text-5xl text-primary relative z-10" />
        </div>
        <p className="text-muted-text font-medium animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );

  if (!loading && !employee) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center">
        <NoData
          className="text-center text-error"
          text={"Employee not found."}
        />
      </div>
    );
  }

  const StatCard = ({ title, amount, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}
      >
        <Icon className={`text-xl ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm text-muted-text font-medium">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>
          ₹ {amount?.toLocaleString() || 0}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full py-8 px-4 md:px-8 bg-secondary/5">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Personal Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Profile Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-secondary to-[#2a1e0b] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FaUser className="text-9xl" />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-1">{employee.name}</h1>
              <p className="text-white/60 text-lg mb-6 capitalize">
                {employee.job} Specialist
              </p>

              <div className="flex flex-wrap gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <FaPhone className="text-primary" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <FaCalendarAlt className="text-primary" />
                  <span>
                    Joined: {new Date(employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <FaBriefcase className="text-primary" />
                  <span className="capitalize">{employee.job}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <Link
              href={`/payments/add/${employee.job}/${employeeId}`}
              className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary/30 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <MdPayment className="text-xl" />
                </div>
                <span className="font-bold text-lg text-secondary">
                  Add Payment
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all">
                ➔
              </div>
            </Link>

            <Link
              href={`/payments/history/${employee.job}/${employeeId}`}
              className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:border-secondary/30 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                  <MdHistory className="text-xl" />
                </div>
                <span className="font-bold text-lg text-secondary">
                  Payment History
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-secondary group-hover:scale-110 transition-all">
                ➔
              </div>
            </Link>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Paid"
            amount={summary?.paid}
            icon={FaMoneyBillWave}
            colorClass="text-green-600"
            bgClass="bg-green-50"
          />
          <StatCard
            title="Unpaid Dues"
            amount={summary?.unpaid}
            icon={FaExclamationCircle}
            colorClass="text-red-500"
            bgClass="bg-red-50"
          />
          <StatCard
            title="Advance Taken"
            amount={summary?.advance}
            icon={FaHandHoldingUsd}
            colorClass="text-orange-500"
            bgClass="bg-orange-50"
          />
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden p-6 md:p-8">
          <ProductList
            title="Assigned Tasks"
            items={tasks}
            isTaskList={true}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            onRemoveTask={handleRemoveTask}
          />
        </div>
      </div>
    </div>
  );
}
