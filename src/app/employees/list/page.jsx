import React from 'react'
import EmployeesByJob from '@/components/employees/EmployeeList'

const workNameList = [
    {
        name: "chittam",
        type: 'task-based'
    },
    {
        name: "asu-winding",
        type: 'task-based'
    },
    {
        name: "asu-marking",
        type: 'task-based'
    },
    {
        name: "tying",
        type: 'time-based'
    },
    {
        name: "dyeing",
        type: 'time-based'
    },
]
const page = () => {
    return (
        <>
            {workNameList.map(({name, type}) => (
                <EmployeesByJob key={name}
                    job={name}
                    type={type}
                />
            ))}
        </>
    )
}

export default page