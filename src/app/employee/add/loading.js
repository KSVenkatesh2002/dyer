import React from 'react'

const loading = () => {
    return (
        <div className="w-full max-w-4xl px-2 sm:px-0 flex justify-center items-center min-h-[calc(100vh-64px)]">
            <div className="space-y-5 mt-6 w-full bg-surface mx-auto p-6 rounded-2xl shadow-md shadow-gray-400 relative animate-pulse">
                <div className="h-8 rounded bg-text/50 w-2/3"></div>

                <div className="space-y-2">
                    <div className="h-4 rounded bg-text/50 w-1/4"></div>
                    <div className="h-12 border rounded w-full"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 rounded bg-text/50 w-1/4"></div>
                    <div className="h-12 border rounded w-full"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 rounded bg-text/50 w-1/4"></div>
                    <div className="h-12 border rounded w-full"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 rounded bg-text/50 w-1/4"></div>
                    <div className="h-24 border rounded w-full"></div>
                </div>

                <div className="h-12 bg-primary rounded w-full"></div>
            </div>
        </div>
    );

}

export default loading