"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import {
  markAttendance,
  editEmployee,
  clearAttendanceHistory,
  getSummaryTimeBased,
  getEmployeeDetailsById,
} from "@/lib/api";
import AttendanceCalendar from "@/components/dashboard/time-based/AttendanceCalendar";
import Details from "./details/Details";
import EmployeeSkeletonPage from "./loading";
import PaymentNavButton from "@/components/dashboard/time-based/PaymentNavButton";
import { FaUserClock } from "react-icons/fa";

export default function AttendanceLogPage() {
  const params = useParams();
  const employeeId = params.employeeId;
  const [pageLoading, setPageLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState({
    employeeId: "",
    name: "",
    phone: "",
    joinDate: undefined,
    salaryPerDay: "",
    job: "",
  });
  const [attendance, setAttendance] = useState([]); // { date: '2024-04-01', status: 'present', paid: false }
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalUnpaidAmount: 0,
    unpaidFullDays: 0,
    unpaidHalfDays: 0,
    totalFullDays: 0,
    totalHalfDays: 0,
    totalAbsentDays: 0,
    totalPaidAmount: 0,
    unpaidPartialAmount: 0,
    advancePay: 0,
    lastPaidDay: null,
  });

  useEffect(() => {
    async function pageLoad() {
      try {
        const employeeRes = await getEmployeeDetailsById(employeeId);
        const employeeDetails = employeeRes.data;
        setEmployee({
          employeeId: employeeDetails.employeeId,
          name: employeeDetails.name,
          phone: employeeDetails.phone,
          joinDate: employeeDetails.joinDate,
          salaryPerDay: employeeDetails.salaryPerDay,
          job: employeeDetails.job,
        });

        const summaryRes = await getSummaryTimeBased(employeeId);
        const summary = summaryRes.data;
        setAttendanceSummary({
          totalUnpaidAmount: summary.totalUnpaidAmount,
          unpaidFullDays: summary.unpaidFullDays,
          unpaidHalfDays: summary.unpaidHalfDays,
          totalFullDays: summary.totalFullDays,
          totalHalfDays: summary.totalHalfDays,
          totalAbsentDays: summary.totalAbsentDays,
          totalPaidAmount: summary.totalPaidAmount,
          unpaidPartialAmount: summary.unpaidPartialAmount,
          advancePay: summary.advancePay,
          lastPaidDay: summary.lastPaidDay,
        });
      } catch (err) {
        toast.error(
          err.response.data.message || "error fetching employee data",
          { theme: "light" }
        );
        setError(err.response.data.message || "error fetching employee data");
      } finally {
        setPageLoading(false);
      }
    }
    pageLoad();
  }, []);

  const handleAttendanceChange = async (date, status) => {
    // console.log('handleAttendanceChange', date)
    try {
      const res = await markAttendance({
        employeeId,
        status,
        date,
        returnType: "detailed",
      });
      const data = res.data;
      if (data.updatedAttendance.status === status) {
        setAttendance((prev) => {
          const exists = prev.some((item) => item.date === date);
          if (exists) {
            return prev.map((item) =>
              item.date === date
                ? {
                    ...item,
                    status: data.updatedAttendance.status,
                    paid: data.updatedAttendance.paid,
                  }
                : item
            );
          } else {
            return [
              ...prev,
              {
                date,
                status: data.updatedAttendance.status,
                paid: data.updatedAttendance.paid,
              },
            ];
          }
        });

        setAttendanceSummary({
          totalUnpaidAmount: data.totalUnpaidAmount,
          unpaidFullDays: data.unpaidFullDays,
          unpaidHalfDays: data.unpaidHalfDays,
          totalFullDays: data.totalFullDays,
          totalHalfDays: data.totalHalfDays,
          totalAbsentDays: data.totalAbsentDays,
          totalPaidAmount: data.totalPaidAmount,
          unpaidPartialAmount: data.unpaidPartialAmount,
          advancePay: data.advancePay,
          lastPaidDay: data.lastPaidDay,
        });
      } else {
        throw new Error("given status not matching");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to mark attendance. Try again.",
        { theme: "light" }
      );
    }
  };

  const handleEmployeeProfileUpdate = (updatedData) => {
    // console.log('handleEmployeeProfileUpdate', {employeeId, workType:'time-based', data:{ ...updatedData, employeeId }})

    editEmployee({
      employeeId,
      workType: "time-based",
      data: { ...updatedData, employeeId },
    })
      .then((res) => {
        const data = res.data;
        setEmployee((prev) => ({
          ...prev,
          name: data.employee.name,
          phone: data.employee.phone,
          salaryPerDay: data.employee.salaryPerDay,
        }));
        toast.success("Employee profile updated successfully!", {
          theme: "light",
        });
      })
      .catch((err) => {
        console.error("Error updating employee profile:", err);
        setError(
          err.response?.data?.message || "Error updating employee profile"
        );
        toast.error(
          err.response?.data?.message || "Error updating employee profile",
          { theme: "light" }
        );
      });
  };
  const handleClearHistory = async (employeeId) => {
    // console.log('handleClearHistory')
    try {
      clearAttendanceHistory({ employeeId })
        .then(() => {
          setAttendance([]);
          setAttendanceSummary({
            totalUnpaidAmount: 0,
            unpaidFullDays: 0,
            unpaidHalfDays: 0,
            totalFullDays: 0,
            totalHalfDays: 0,
            totalAbsentDays: 0,
            totalPaidAmount: 0,
            unpaidPartialAmount: 0,
            advancePay: 0,
            lastPaidDay: null,
          });
          toast.success("attendance history cleared", { theme: "light" });
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            error.response?.data?.error ||
              "Unable to clear, Try after sometime",
            { theme: "light" }
          );
        });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error clearing attendance history",
        { theme: "light" }
      );
      setError(
        err.response?.data?.message || "Error clearing attendance history"
      );
    }
  };

  if (pageLoading || !employee) return <EmployeeSkeletonPage />;
  return (
    <div className="min-h-full py-8 text-text-dark bg-background/30">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-secondary rounded-xl text-white shadow-lg">
            <FaUserClock className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">
              Time Dashboard
            </h1>
            <p className="text-muted-text font-medium">
              Manage attendance & payments for {employee.name}
            </p>
          </div>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl shadow-sm flex items-center justify-center font-medium animate-pulse">
            <p>{error}</p>
          </div>
        )}

        <Details
          employeeId={employeeId}
          employee={employee}
          attendanceSummary={attendanceSummary}
          onEmployeeProfileUpdate={handleEmployeeProfileUpdate}
          onClearHistory={handleClearHistory}
        />

        <AttendanceCalendar
          employeeId={employeeId}
          attendance={attendance}
          setAttendance={setAttendance}
          joinDate={employee.joinDate}
          onAttendanceChange={handleAttendanceChange}
          lastPaidDay={attendanceSummary.lastPaidDay}
        />

        <PaymentNavButton employeeId={employeeId} job={employee.job} />
      </div>
    </div>
  );
}
