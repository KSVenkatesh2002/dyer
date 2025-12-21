"use client";
import React from "react";
import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { cn } from "@/lib/utilty/cn";
import { usePathname } from "next/navigation";

const Header = ({ className = "" }) => {
  const pathname = usePathname();
  return (
    <header
      className={cn(
        "px-6 py-3",
        "flex items-center justify-between",
        "bg-white shadow-sm border border-neutral-100",
        "transition-all duration-300",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="relative w-[50px] h-[50px]">
          <Image
            src="/image/logo.png"
            fill
            className="object-contain"
            alt="dyer-handloom-logo"
            sizes="50px"
          />
        </div>
        <h1 className="text-text-dark text-xl font-bold tracking-tight hidden sm:block">
          Dyer
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <SignedOut>
          <div className="flex items-center gap-3">
            {/* Login Button */}
            <SignInButton>
              <button className="px-5 py-2 rounded-xl text-primary font-medium text-sm transition-all hover:bg-primary/5">
                Login
              </button>
            </SignInButton>

            {/* Register Button */}
            <SignUpButton>
              <button className="px-5 py-2 rounded-xl bg-primary text-white font-medium text-sm shadow-md hover:shadow-lg hover:bg-primary/90 transition-all transform hover:-translate-y-0.5">
                Register
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            {pathname !== "/dashboard" && (
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2",
                  "rounded-xl bg-secondary text-surface text-sm font-medium",
                  "transition-all duration-200 hover:bg-secondary/90 hover:shadow-md hidden sm:block"
                )}
              >
                Dashboard
              </Link>
            )}
            {/* Use customized sign out trigger if needed, or rely on UserButton which has sign out */}
            <SignOutButton>
              <button
                className="text-muted-text hover:text-error transition-colors p-2"
                title="Sign Out"
              >
                <FaSignOutAlt size={18} />
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
