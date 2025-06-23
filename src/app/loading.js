import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const loading = () => {
    return (
        <div className='min-h-[calc(100vh-64px)] h-full w-full flex justify-center items-center'>
            <AiOutlineLoading3Quarters className='animate-spin' />
        </div>
    )
}

export default loading