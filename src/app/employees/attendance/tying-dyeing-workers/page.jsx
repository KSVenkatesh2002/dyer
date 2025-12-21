"use client";
import { useEffect, useState } from "react";
import { markAttendance, employeeListPage } from "@/lib/api";
import { toast } from "react-toastify";
import {
  MdAutorenew,
  MdEdit,
  MdClose,
  MdAdd,
  MdCheckCircle,
  MdCancel,
  Mdtimelapse,
  MdPerson,
  MdWork,
} from "react-icons/md";
import Link from "next/link";
import dayjs from "dayjs";
import Skeleton from "./loading";
import NoData from "@/components/NoData";
import { cn } from "@/lib/utilty/cn";
import Image from "next/image";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState(null);
  const [attendanceMarkLoading, setAttendanceMarkLoading] = useState("");
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  const TODAY = dayjs().format("YYYY-MM-DD");

  const handleAttendanceChange = async (empId, status) => {
    setEditId("");
    if (attendanceMarkLoading !== "" && attendanceMarkLoading !== empId) {
      toast.error("Attendance already marking", { theme: "dark" });
      return;
    }
    const previousStatus = employees.find(
      (emp) => emp._id === empId
    )?.attendanceStatus;
    if (previousStatus === status) {
      toast.info("Attendance already marked as " + status, {
        theme: "colored",
      });
      return;
    }
    setAttendanceMarkLoading(empId);
    try {
      const res = await markAttendance({
        employeeId: empId,
        status,
        date: TODAY,
        returnType: "simple",
      });
      const data = res.data;
      if (data.updatedAttendance.status === status) {
        toast.success("Attendance marked: " + status, {
          theme: "colored",
          icon: <MdCheckCircle className="text-xl" />,
        });

        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === empId
              ? {
                  ...emp,
                  attendanceStatus: data.updatedAttendance.status,
                  totalUnpaidAmount: data.totalUnpaidAmount,
                  unpaidFullDays: data.unpaidFullDays,
                  unpaidHalfDays: data.unpaidHalfDays,
                  unpaidPartialAmount: data.unpaidPartialAmount,
                  paid: data.updatedAttendance.paid,
                }
              : emp
          )
        );
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(
        error.response?.data?.error || "Failed to mark attendance. Try again.",
        { theme: "colored" }
      );
    } finally {
      setTimeout(() => {
        setAttendanceMarkLoading("");
      }, 300);
    }
  };

  useEffect(() => {
    employeeListPage()
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Error while fetch employee list page:", err);
        toast.error(
          err.response?.data?.error || "Failed to fetch employees. Try again.",
          { theme: "colored" }
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const StatusButton = ({ status, currentStatus, onClick, disabled }) => {
    const isSelected = currentStatus === status;
    const colors = {
      present: "bg-present text-white border-present",
      half: "bg-half text-white border-half",
      absent: "bg-absent text-white border-absent",
    };
    const defaultColors =
      "bg-white text-muted-text border-border hover:bg-gray-50";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex-1 py-1.5 px-2 rounded-lg border text-sm font-semibold capitalize transition-all duration-200",
          isSelected ? colors[status] : defaultColors,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {status}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h2 className="text-3xl font-bold text-text-dark">Attendance</h2>
          <p className="text-muted-text text-sm mt-1">
            Manage daily attendance for Tying / Dyeing workers
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-lg border border-primary/20">
            {dayjs(TODAY).format("DD MMM YYYY")}
          </div>
          <Link href="/employees/add">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-text rounded-xl font-medium shadow-md hover:bg-primary/90 transition-all hover:shadow-lg">
              <MdAdd className="text-xl" />
              <span className="hidden sm:inline">Add Employee</span>
              <Image src={"/image/service/add_employees.png"} alt="add employees" width={20} height={20}/>
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : !loading && (!employees || employees.length === 0) ? (
        <NoData text={"No employees found"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Card Header: Info */}
              <div className="p-5 flex items-start justify-between border-b border-neutral-50 bg-neutral-50/50">
                <Link
                  href={`/dashboard/time-based/${emp._id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl font-bold border-2 border-white shadow-sm group-hover:border-primary/50 transition-colors">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-dark group-hover:text-primary transition-colors">
                      {emp.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-text font-medium uppercase tracking-wide">
                      <MdWork className="text-primary" />
                      {emp.job}
                    </div>
                  </div>
                </Link>
                <div className="text-right">
                  <div className="text-sm font-bold text-text-dark">
                    ₹{emp.salaryPerDay}
                  </div>
                  <div className="text-[10px] text-muted-text font-medium uppercase">
                    / Day
                  </div>
                </div>
              </div>

              {/* Card Body: Stats */}
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="bg-success/10 rounded-xl p-3 flex flex-col items-center justify-center border border-success/20">
                  <span className="text-xs text-muted-text font-bold uppercase mb-1">
                    Full Days
                  </span>
                  <span className="text-xl font-bold text-present">
                    {emp.unpaidFullDays || 0}
                  </span>
                </div>
                <div className="bg-warning/10 rounded-xl p-3 flex flex-col items-center justify-center border border-warning/20">
                  <span className="text-xs text-muted-text font-bold uppercase mb-1">
                    Half Days
                  </span>
                  <span className="text-xl font-bold text-half">
                    {emp.unpaidHalfDays || 0}
                  </span>
                </div>
                <div className="col-span-2 bg-primary/5 rounded-xl p-3 flex items-center justify-between border border-primary/10 px-4">
                  <span className="text-xs font-bold text-secondary uppercase">
                    Unpaid Total
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{emp.totalUnpaidAmount || 0}
                  </span>
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="p-4 mt-auto border-t border-neutral-100 bg-white">
                {attendanceMarkLoading === emp._id ? (
                  <div className="w-full py-2 bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center text-muted-text">
                    <MdAutorenew className="animate-spin mr-2" /> Marking...
                  </div>
                ) : emp.attendanceStatus && editId !== emp._id ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex-1 py-2 rounded-xl text-center text-sm font-bold capitalize flex items-center justify-center gap-2 shadow-sm",
                        emp.attendanceStatus === "present"
                          ? "bg-present text-white"
                          : emp.attendanceStatus === "absent"
                          ? "bg-absent text-white"
                          : "bg-half text-white"
                      )}
                    >
                      {emp.attendanceStatus}
                      {emp.paid && (
                        <span className="bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
                          PAID
                        </span>
                      )}
                    </div>
                    {!emp.paid && (
                      <button
                        onClick={() => setEditId(emp._id)}
                        className="p-2 text-muted-text hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Edit Attendance"
                      >
                        <MdEdit className="text-xl" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                    <StatusButton
                      status="present"
                      currentStatus={emp.attendanceStatus}
                      onClick={() => handleAttendanceChange(emp._id, "present")}
                    />
                    <StatusButton
                      status="half"
                      currentStatus={emp.attendanceStatus}
                      onClick={() => handleAttendanceChange(emp._id, "half")}
                    />
                    <StatusButton
                      status="absent"
                      currentStatus={emp.attendanceStatus}
                      onClick={() => handleAttendanceChange(emp._id, "absent")}
                    />
                    {editId === emp._id && (
                      <button
                        onClick={() => setEditId("")}
                        className="p-1.5 text-muted-text hover:text-error rounded-full hover:bg-error/10 transition-colors"
                      >
                        <MdClose />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
