'use client'
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify';

// set changing attendance status should not done before last paid date : done
// set changing attendance status should not done before joining date : done
// set changing attendance status should not done for future dates : done
// set changing attendance status should not done for paid days : done

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AttendanceCalendar({ attendance, onAttendanceChange, joinDate, lastPaidDay }) {
    const [currentDate, setCurrentDate] = useState(dayjs())
    const [attendanceMarkLoading, setAttendanceMarkLoading] = useState([])
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const closePopup = () => {
        setShowPicker(false);
        setSelectedDate('');
    };



    const handleAttendanceChange = async (date, status) => {
        setAttendanceMarkLoading(prev => [...prev, date])
        onAttendanceChange(date, status)
        setAttendanceMarkLoading(prev => prev.filter(item => item !== date))
    }

    const PopUp = () => {
        return showPicker && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

                <div
                    className=" bg-secondary p-6 rounded-xl text-center max-w-sm mx-auto space-y-2 shadow-lg text-text"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="popupTitle"
                    aria-describedby="popupDesc"
                >
                    <h2 id="popupTitle" className="text-xl font-bold ">Mark Attendance</h2>
                    <p className='font-semibold text-text/60'>{selectedDate}</p>
                    <p id="popupDesc" className='p-2 bg-surface/50 rounded-lg'>if employee have advance amount then you can change attendance in future</p>

                    <div className="flex min-w-full rounded-lg overflow-hidden shadow shadow-gray-700">
                        {['present', 'half', 'absent', 'holiday'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    handleAttendanceChange(selectedDate, status);
                                    closePopup()
                                }}
                                className={`w-full py-2 text-text text-sm font-semibold ${status === 'present' ? 'bg-present' : status === 'half' ? 'bg-half' : status == 'absent' ? 'bg-absent' : 'bg-holiday'} hover:bg-opacity-10 hover:cursor-pointer transition-colors duration-200 capitalize ${attendanceMarkLoading.includes(selectedDate) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className='flex flex-wrap justify-evenly items-baseline'>

                        <button className="w-1/2 rounded-md p-2 text-center text-sm text-gray-200 bg-gray-800 capitalize">remove entry</button>
                        <button
                            className="w-1/2  text-center text-sm text-gray-800 underline "
                            onClick={() => { closePopup() }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCalendar = () => {
        const startOfMonth = currentDate.startOf('month')
        const endOfMonth = currentDate.endOf('month')
        const startDay = startOfMonth.day()
        const daysInMonth = currentDate.daysInMonth()

        const weeks = []
        let dayCounter = 1 - startDay

        while (dayCounter <= daysInMonth) {
            const week = []
            for (let i = 0; i < 7; i++) {
                const date = currentDate.date(dayCounter).format('YYYY-MM-DD')
                const match = attendance.find((item) => item.date === date);
                const status = match?.status;
                const paid = match?.paid;


                let bg = 'bg-surface text-text'
                let triangleColor = ''
                if (paid) {
                    if (status === 'present') triangleColor = 'border-t-green-600'
                    else if (status === 'half') triangleColor = 'border-t-yellow-500'
                    else if (status === 'absent') triangleColor = 'border-t-red-500'
                    else if (status === 'holiday') triangleColor = 'border-t-blue-500'
                }

                if (selectedDate === date) bg = 'bg-primary text-white'
                else if (paid && (status === 'present' || status === 'half')) bg = 'bg-disabled text-mutedText'
                else if (status === 'present') bg = 'bg-present '
                else if (status === 'half') bg = 'bg-half '
                else if (status === 'absent') bg = 'bg-absent '
                else if (status === 'holiday') bg = 'bg-holiday '


                week.push(
                    dayCounter > 0 && dayCounter <= daysInMonth ? (
                        <td
                            key={i}
                            className={`relative w-14 h-14 text-center align-middle box-content ${selectedDate === date && ' bg-accent'} ${attendanceMarkLoading.includes(date) ? 'bg-surface' : bg} cursor-pointer`}
                            onClick={() => {
                                const attendanceDate = new Date(date);
                                const join = new Date(joinDate);

                                // Normalize to YYYY-MM-DD strings
                                const attendanceDateStr = attendanceDate.toISOString().slice(0, 10);
                                const joinDateStr = join.toISOString().slice(0, 10);
                                const lastPaidDateStr = new Date(lastPaidDay).toISOString().slice(0, 10);
                                if (paid) {
                                    toast.warn('You can\'t change attendance for paid days', { theme: 'light' });
                                    return;
                                } else if (attendanceDateStr < joinDateStr) {
                                    toast.warn('You cannot mark attendance before joining date', { theme: 'light' });
                                    return;
                                } else if (attendanceDateStr < lastPaidDateStr) {
                                    toast.warn('Attendance entries must be on or after the last unpaid date. Days that are already covered by payment cannot be modified', { theme: 'light' });
                                    return;
                                } else if (!paid && attendanceDate > new Date()) {
                                    toast.warn('You cannot mark attendance for future dates', { theme: 'light' });
                                    return;
                                } else {
                                    setSelectedDate(date);
                                    setShowPicker(true);
                                }

                            }}
                        >
                            {paid && (
                                <div className={`absolute top-0 left-0 w-0 h-0 border-t-[16px] ${triangleColor} border-r-[16px] border-r-transparent z-10`} />
                            )}

                            {attendanceMarkLoading.includes(date) ? (
                                <img src="../loading.gif" alt="Loading.." className="bg-surface m-auto" />
                            ) : (
                                <span className="text-text text-xl relative z-20">{dayCounter}</span>
                            )}
                        </td>

                    ) : (
                        <td key={i} className="w-14 h-14 bg-mutedText/10" />
                    )
                )
                dayCounter++
            }
            weeks.push(<tr key={dayCounter}>{week}</tr>)
        }

        return weeks
    }

    return (
        <div className="w-full rounded shadow text-text space-y-2 ">
            <div className="flex justify-between rounded-t">
                <button
                    className=" px-4 py-2 border rounded-sm"
                    onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
                >
                    Prev
                </button>

                <h1 className="flex justify-center items-center mx-1  w-full text-xl font-semibold tracking-wide ">
                    {/* <p>Attendance</p> */}
                    {currentDate.format('MMMM YYYY')}
                </h1>

                <button
                    className="px-4 py-2 border rounded-sm"
                    onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
                >
                    Next
                </button>
            </div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day} className="p-2 bg-secondary">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody >{renderCalendar()}</tbody>
            </table>
            <PopUp />
        </div>
    )
}
