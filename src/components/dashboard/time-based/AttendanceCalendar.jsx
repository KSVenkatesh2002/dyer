"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { getAttendanceRecord } from "@/lib/api";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utilty/cn";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendanceCalendar({
  employeeId,
  attendance,
  setAttendance,
  onAttendanceChange,
  joinDate,
  lastPaidDay,
}) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [attendanceMarkLoading, setAttendanceMarkLoading] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingMonth, setLoadingMonth] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoadingMonth(true);
      const month = currentDate.month() + 1; // dayjs: 0-based
      const year = currentDate.year();
      try {
        const attendanceRes = await getAttendanceRecord(
          employeeId,
          month,
          year
        );
        setAttendance(attendanceRes.data);
      } catch (err) {
        toast.error("Failed to fetch attendance");
      } finally {
        setLoadingMonth(false);
      }
    };

    fetchAttendance();
  }, [currentDate]);

  const closePopup = () => {
    setShowPicker(false);
    setSelectedDate("");
  };

const canGoToPreviousMonth = useMemo(() => {
  const currentMonthStart = dayjs(currentDate).startOf("month");
  const joinMonthStart = dayjs(joinDate).startOf("month");

  return currentMonthStart.isAfter(joinMonthStart);
}, [currentDate, joinDate]);


  const handleAttendanceChange = async (date, status) => {
    setAttendanceMarkLoading((prev) => [...prev, date]);
    onAttendanceChange(date, status);
    setAttendanceMarkLoading((prev) => prev.filter((item) => item !== date));
    closePopup();
  };

  const PopUp = () => {
    return (
      showPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div
            className="bg-white p-0 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-secondary p-4 flex justify-between items-center text-white">
              <div>
                <h2 className="text-lg font-bold">Mark Attendance</h2>
                <p className="text-xs opacity-70 flex items-center gap-1">
                  <FaCalendarAlt /> {selectedDate}
                </p>
              </div>
              <button
                onClick={closePopup}
                className="text-white/70 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                Note: If employee has advance amount, you can change attendance
                for future dates.
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    status: "present",
                    label: "Present",
                    color:
                      "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
                  },
                  {
                    status: "half",
                    label: "Half Day",
                    color:
                      "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
                  },
                  {
                    status: "absent",
                    label: "Absent",
                    color:
                      "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
                  },
                  {
                    status: "holiday",
                    label: "Holiday",
                    color:
                      "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
                  },
                ].map(({ status, label, color }) => (
                  <button
                    key={status}
                    onClick={() => handleAttendanceChange(selectedDate, status)}
                    disabled={attendanceMarkLoading.includes(selectedDate)}
                    className={`py-3 px-4 rounded-xl font-bold border ${color} transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                className="w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                onClick={closePopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )
    );
  };

  const renderCalendar = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const weeks = [];
    let dayCounter = 1 - startDay;

    while (dayCounter <= daysInMonth) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateObj = currentDate.date(dayCounter);
        const date = dateObj.format("YYYY-MM-DD");
        const match = attendance.find((item) => item.date === date);
        const status = match?.status;
        const paid = match?.paid;
        const isLoading = attendanceMarkLoading.includes(date);

        let cellClass = "bg-white text-gray-700 hover:bg-gray-50";
        let statusDot = null;

        // Status Styling logic
        if (status === "present") {
          cellClass = "bg-green-50 text-green-900 border-green-100";
          statusDot = "bg-green-500";
        } else if (status === "half") {
          cellClass = "bg-yellow-50 text-yellow-900 border-yellow-100";
          statusDot = "bg-yellow-500";
        } else if (status === "absent") {
          cellClass = "bg-red-50 text-red-900 border-red-100";
          statusDot = "bg-red-500";
        } else if (status === "holiday") {
          cellClass = "bg-blue-50 text-blue-900 border-blue-100";
          statusDot = "bg-blue-500";
        }

        if (paid) {
          cellClass +=
            " opacity-60 bg-gray-100 text-gray-400 cursor-not-allowed"; // Paid days look disabled
        }

        if (selectedDate === date) {
          cellClass += " ring-2 ring-primary ring-inset";
        }

        week.push(
          dayCounter > 0 && dayCounter <= daysInMonth ? (
            <td key={i} className="p-1 align-top h-24">
              <div
                onClick={() => {
                  const attendanceDate = new Date(date);
                  const join = new Date(joinDate);
                  // normalization
                  const attendanceDateStr = attendanceDate
                    .toISOString()
                    .slice(0, 10);
                  const joinDateStr = join.toISOString().slice(0, 10);
                  const lastPaidDateStr = new Date(lastPaidDay)
                    .toISOString()
                    .slice(0, 10);

                  if (paid) {
                    toast.warn("Cannot change paid days", { theme: "colored" });
                    return;
                  } else if (attendanceDateStr < joinDateStr) {
                    toast.warn("Cannot mark before joining date", {
                      theme: "colored",
                    });
                    return;
                  } else if (attendanceDateStr < lastPaidDateStr) {
                    toast.warn("Cannot modify days before last paid date", {
                      theme: "colored",
                    });
                    return;
                  } else if (!paid && attendanceDate > new Date()) {
                    toast.warn("Cannot mark future dates", {
                      theme: "colored",
                    });
                    return;
                  } else {
                    setSelectedDate(date);
                    setShowPicker(true);
                  }
                }}
                className={`w-full h-full rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${cellClass}`}
              >
                <span
                  className={`text-sm font-bold ${status ? "" : "opacity-50"}`}
                >
                  {dayCounter}
                </span>

                {paid && (
                  <div className="absolute top-2 right-2 text-[0.6rem] font-bold px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded uppercase tracking-wider">
                    Paid
                  </div>
                )}

                {isLoading ? (
                  <div className="self-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-primary" />
                  </div>
                ) : (
                  status && (
                    <div className="flex items-center gap-1 mt-auto">
                      <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                      <span className="text-xs font-medium capitalize truncate">
                        {status}
                      </span>
                    </div>
                  )
                )}
              </div>
            </td>
          ) : (
            <td key={i} className="p-1 h-24 bg-transparent" />
          )
        );
        dayCounter++;
      }
      weeks.push(<tr key={`week-${dayCounter}`}>{week}</tr>);
    }
    return weeks;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 flex items-center justify-between border-b border-neutral-100">

          <button
          disabled={!canGoToPreviousMonth}
            className={cn("p-3 rounded-full hover:bg-neutral-100 text-muted-text hover:text-text-dark transition-colors", canGoToPreviousMonth ? "text-secondary" : "cursor-not-allowed opacity-50")}
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          >
            <FaChevronLeft />
          </button>
        

        <div className="text-center">
          <h2 className="text-xl font-bold text-text-dark flex items-center justify-center gap-2">
            <FaCalendarAlt className="text-secondary" />
            {currentDate.format("MMMM YYYY")}
          </h2>
          {loadingMonth && (
            <p className="text-xs text-primary animate-pulse mt-1">
              Updating...
            </p>
          )}
        </div>

        <button
          className="p-3 rounded-full hover:bg-neutral-100 text-secondary hover:text-text-dark transition-colors"
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="pb-4 text-sm font-bold text-muted-text uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>

      <div className="bg-neutral-50 p-4 text-xs text-center text-muted-text border-t border-neutral-100 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div> Present
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Half Day
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div> Absent
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> Holiday
        </div>
        <div className="flex items-center gap-2">
          <div className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-500 font-bold uppercase text-[0.6rem]">
            Paid
          </div>{" "}
          Locked
        </div>
      </div>

      <PopUp />
    </div>
  );
}
