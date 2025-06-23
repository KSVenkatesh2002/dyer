import React from 'react'
import Link from 'next/link';
import {
    SignInButton,
    SignOutButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

const profileImage = 'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=175&h=180&c=7&r=0&o=5&pid=1.7'; 
const Header = () => {
    return (
        <header className="bg-primary p-4 shadow-md w-full flex items-center justify-between">
            <Link href="/">
                <h1 className="text-gray-200 text-xl font-bold text-center">
                    Dyer Working Log
                </h1>
            </Link>
            <div>
            <SignedOut>
                <SignInButton>
                    login
                </SignInButton>
                {" "}
                <SignUpButton > 
                    Register
                </SignUpButton>
            </SignedOut>
            
            <SignedIn>
                {/* <UserButton /> */}
                <SignOutButton/>
            </SignedIn></div>
            

        </header>
    )
}

export default Header