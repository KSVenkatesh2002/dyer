'use client'
import React from 'react'
import Link from 'next/link';

const clientNav = [
    {
        name: 'add client',
        href: '/clients/add',
    }
];
export default function ClientNavButton() {
    return (
        <div className="space-y-4 p-5">

            {clientNav.map((navBut) => (
                <Link
                    key={navBut.name}
                    href={navBut.href}
                    className=" group p-4 w-full rounded-2xl bg-background block"
                >
                    <h2 className=" text-center h-10 text-lg capitalize font-semibold">
                        {navBut.name}
                    </h2>
                </Link>
            ))}

        </div>
    )
}