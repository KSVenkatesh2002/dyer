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
import { FaSignOutAlt } from "react-icons/fa";

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
          <div className="flex items-center gap-4">

            {/* Login Button */}
            <SignInButton>
              <span className="px-6 py-2 rounded-lg border-2 border-orange-600 text-orange-600 font-semibold text-base capitalize tracking-wide transition-all duration-200 hover:bg-orange-600 hover:text-white hover:shadow-md cursor-pointer">
                Login
              </span>
            </SignInButton>

            {/* Register Button */}
            <SignUpButton>
              <span className="px-6 py-2 rounded-lg bg-orange-600 border-2 border-orange-600 text-white font-semibold text-base capitalize tracking-wide transition-all duration-200 hover:bg-orange-700 hover:border-orange-700 hover:shadow-md cursor-pointer">
                Register
              </span>
            </SignUpButton>

          </div>
        </SignedOut>


        <SignedIn>
          {/* <UserButton /> */}
          <SignOutButton>
            <FaSignOutAlt className='text-2xl font-bold text-white' />
          </SignOutButton>
        </SignedIn></div>


    </header>
  )
}

export default Header