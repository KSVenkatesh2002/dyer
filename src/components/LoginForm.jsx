"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

export default function LoginForm() {

    const { isLoaded, signIn, setActive } = useSignIn()
    // const [code, setCode] = useState("")
    // const [verify, setVerify] = useState(false)
    const router = useRouter()

    const [form, setForm] = useState({
        identifier: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(form);
        if (loading) return
        setLoading(true)
        setError('')
        try {
            const signinAttempt = await signIn.create({
                ...form,
            })

            if (signinAttempt.status == "complete") {
                await setActive({session: signinAttempt.createdSessionId})
                router.replace('/')
            } else {
                setError(JSON.stringify(signinAttempt, null, 2))
                console.log("====================================");
                console.log('Error login status not complete:', signinAttempt);
                console.log("====================================");
            }

        } catch (error) {
            setError(error.message)
            console.log("====================================");
            console.error("error during login", error);
            console.log("====================================");
        } finally {
            setLoading(false)
        }
    };

    if (!isLoaded) return;

    return (
        <> 
            <form
                onSubmit={handleSubmit}
                className="flex items-center justify-center w-full min-h-[calc(100vh-64px)] p-8"
            >
                <div className="max-w-md w-full m-auto rounded-2xl p-8 py-12 md:py-12 space-y-8   border ">

                    {/* show error */}
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

                    <div className="font-bold text-neutral-800 dark:text-neutral-200 flex flex-col space-y-2">
                        <Link href="/" className="flex items-start w-full justify-start">
                            <h3 className="text-black font-bold text-[28px]">LOGIN</h3>
                        </Link>
                        <p className="font-normal text-[14px] text-neutral-800 ">
                            Welcome back
                        </p>
                    </div>

                    {/* form input */}
                    <div className="flex flex-col space-y-6 mb-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <label
                                htmlFor="identifier"
                                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                name="identifier"
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
                    </div>

                    {/* login button */}
                    <div className="w-full">
                        <button 
                            className={`flex justify-center font-semibold border items-center rounded-md py-2 px-8 w-full text-[16px]  cursor-pointer   ring-[#f55418]/20  ${
                                loading  
                                ? 'bg-accent/10 text-gray-400/50 border-accent/20' 
                                : 'bg-accent hover:text-accent hover:bg-transparent text-white border-accent'
                            }`} 
                            disabled={loading} 
                            type="submit"
                        >
                            Login
                        </button>
                    </div>

                    {/* navigate to register */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-neutral-800 ">
                            create new Account{" "}
                            <Link href={"/register"}>
                                <span className="text-[#1565C0] ">Register</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
}