import React from 'react'
const skeletons = Array.from({ length: 4 });
const loading = () => {
    return (
        <div className="max-w-3xl mx-auto w-full space-y-4 p-4">
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col p-3 rounded-lg shadow-xl shadow-gray-400 gap-2 bg-background/50 animate-pulse"
                >
                    {/* Top row: name + dots + salary */}
                    <div className="flex justify-end items-stretch gap-2 w-full">
                        {/* Name block */}
                        <div className="flex flex-row items-center gap-2 grow">
                            <div className="bg-secondary h-10 w-full rounded-lg"></div>
                        </div>

                        {/* Days count (dots) */}
                        <div className="bg-primary/50 px-5 p-1 rounded-md flex flex-col justify-around gap-2">
                            <div className="bg-green-500 size-5 rounded-full"></div>
                            <div className="bg-half size-5 rounded-full"></div>
                        </div>

                        {/* Salary block */}
                        <div className="bg-primary/50 px-5 p-4 rounded-md w-16 h-10"></div>
                    </div>

                    {/* Bottom row: attendance bar */}
                    <div className="w-full p-1 bg-secondary rounded-lg flex justify-between items-center">
                        <div className="bg-present w-1/4 h-8 rounded-md"></div>
                        <div className="bg-half w-1/4 h-8 rounded-md"></div>
                        <div className="bg-absent w-1/4 h-8 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default loading