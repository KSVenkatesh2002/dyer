import RegisterForm from "@/components/RegisterForm";
import React from "react";
import { SignUp } from '@clerk/nextjs'
export default async function Register() {
    return (
        <div className='w-full min-h-[calc(100vh-64px)] flex '>
            <RegisterForm />
            {/* <SignUp></SignUp> */}
            
        </div>
    );
}