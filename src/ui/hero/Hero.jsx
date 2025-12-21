import Image from 'next/image'
import React from 'react'

export default function Hero() {
    return (
        <div className="flex flex-col lg:flex-row gap-10 items-center mb-14">
            <div className="flex-1">
                <h1 className="lg:text-4xl text-2xl font-extrabold text-accent leading-tight">
                    Assign Work & <br /> Manage Textile Production
                </h1>
                <p className="mt-4 text-textMain/70 max-w-md">
                    Streamline your textile workflow, track progress,
                    and manage resources efficiently.
                </p>
            </div>

            <div className="flex-1 relative lg:w-1/2 w-full h-96">
                <Image
                    src="/image/hero.png"
                    alt="Textile production workflow illustration"
                    fill
                    className="mx-auto"
                />
            </div>
        </div>
    )
}
