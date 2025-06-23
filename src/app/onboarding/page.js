'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingComponent() {
    const { user } = useUser()
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const handleSubmit = async (formData) => {
        setLoading(true)
        setError(null)
        try {
            await completeOnboarding(formData)
            await user?.reload()
            setTimeout(() => {
                router.push('/')
            }, 100)
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            action={handleSubmit}
            className="flex items-center justify-center container mx-auto w-full min-h-[calc(100vh-64px)]"
        >
            <div className="max-w-md w-full mx-auto rounded-2xl p-8 py-12 md:py-12 space-y-8">
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                <div className="font-bold text-neutral-800 dark:text-neutral-200 flex flex-col space-y-2">
                    <h3 className="text-black font-bold text-[28px]">Complete Your Profile</h3>
                    <p className="font-normal text-[14px] text-neutral-800">
                        Enter Your Company Details
                    </p>
                </div>

                <div className="flex flex-col space-y-6 mb-4">
                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-sm font-medium text-black">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            required
                            className="block w-full px-3 py-3 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:bg-gray-50 sm:text-sm"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-sm font-medium text-black">Location</label>
                        <input
                            type="text"
                            name="location"
                            required
                            className="block w-full px-3 py-3 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:bg-gray-50 sm:text-sm"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-sm font-medium text-black">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            required
                            className="block w-full px-3 py-3 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:bg-gray-50 sm:text-sm"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-sm font-medium text-black">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            className="block w-full px-3 py-3 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:bg-gray-50 sm:text-sm"
                            placeholder="Brief description"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-sm font-medium text-black">Owners List</label>
                        <input
                            type="text"
                            name="owners"
                            required
                            className="block w-full px-3 py-3 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:bg-gray-50 sm:text-sm"
                            placeholder="Owner names"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex justify-center font-semibold border items-center rounded-md py-2 px-8 w-full text-[16px] ring-[#f55418]/20 ${
                            loading
                                ? 'bg-accent/10 text-gray-400/50 border-accent/20 cursor-not-allowed'
                                : 'bg-accent hover:text-accent hover:bg-transparent text-white border-accent'
                        }`}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    )
}
