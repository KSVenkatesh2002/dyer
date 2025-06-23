"use client";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterForm = () => {

    const { isLoaded, signUp, setActive } = useSignUp()
    const [code, setCode] = useState("")
    const [verify, setVerify] = useState(false)
    const router = useRouter()

    const [form, setForm] = useState({
        username: '',
        emailAddress: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleChange(e) {
        e.preventDefault();
        setError('')
        const target = e.target
        const name = target.name
        const value = target.value

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))

        console.log(form)

    }

    async function handleVerificationSubmit(e) {
        e.preventDefault()
        if (loading) return
        setLoading(true)
        setError('')

        try {
            const signupAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })
            if (signupAttempt.status === 'complete') {
                await setActive({ session: signupAttempt.createdSessionId })
                console.log('session', signupAttempt.createdSessionId)
                router.replace('/')
            } else {
                console.log("====================================");
                console.error('Error status not complete:', JSON.stringify(signupAttempt, null, 2))
                console.log("====================================");
            }
        } catch (error) {
            setError(error.message)
            console.error('Error while otp verification:', JSON.stringify(error, null, 2))
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(form);
        if (loading) return
        setLoading(true)
        setError('')
        try {

            await signUp.create({
                ...form,
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setVerify(true)

        } catch (error) {
            setError(error.message)
            console.log("====================================");
            console.error("error during register", error);
            console.log("====================================");
        } finally {
            setLoading(false)
        }
    };

    if (!isLoaded) return;

    if (verify) {
        return (
            <form
                onSubmit={handleVerificationSubmit}
                className="flex flex-col items-center justify-center container mx-8 w-full min-h-[calc(100vh-64px)] space-y-5 "
            >
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

                <div className="flex flex-col space-y-2 w-full">
                    <label
                        htmlFor="code"
                        className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Code
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                        placeholder="enter code"
                    />
                </div>
                <div className="w-full">
                    <button
                        className={`flex justify-center font-semibold border items-center rounded-md py-2 px-8 w-full text-[16px]  cursor-pointer   ring-[#f55418]/20  ${loading
                                ? 'bg-accent/10 text-gray-400/50 border-accent/20'
                                : 'bg-accent hover:text-accent hover:bg-transparent text-white border-accent'
                            }`}
                        disabled={loading}
                        type="submit"
                    >
                        verify
                    </button>
                </div>
            </form>
        )
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex items-center justify-center container mx-auto w-full min-h-[calc(100vh-64px)]  "
            >
                <div className="max-w-md w-full mx-auto rounded-2xl p-8 py-12 md:py-12 space-y-8 ">
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    <div className="font-bold text-neutral-800 dark:text-neutral-200 flex flex-col space-y-2">
                        <Link href="/" className="flex items-start w-full justify-start">
                            <h3 className="text-black font-bold text-[28px]">Create Company</h3>
                        </Link>
                        <p className="font-normal text-[14px] text-neutral-800 ">
                            Enter Your Details
                        </p>
                    </div>

                    <div className="flex flex-col space-y-6 mb-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                onChange={(e) => handleChange(e)}
                                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                                placeholder="username"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-full">
                            <label
                                htmlFor="emailAddress"
                                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                name="emailAddress"
                                onChange={(e) => handleChange(e)}
                                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                                placeholder="abc@gmail.com"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-full">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                onChange={(e) => handleChange(e)}
                                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                                placeholder="password"
                            />
                        </div>
                        {/* CAPTCHA Widget */}
                        <div id="clerk-captcha"></div>
                    </div>
                    <div className="w-full">
                        <button
                            className={`flex justify-center font-semibold border items-center rounded-md py-2 px-8 w-full text-[16px]  cursor-pointer   ring-[#f55418]/20  ${loading
                                    ? 'bg-accent/10 text-gray-400/50 border-accent/20'
                                    : 'bg-accent hover:text-accent hover:bg-transparent text-white border-accent'
                                }`}
                            disabled={loading}
                            type="submit"
                        >
                            Create
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium text-neutral-800 ">
                            Already have an account?{" "}
                            <Link href={"/login"}>
                                <span className="text-[#1565C0] ">Login</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;