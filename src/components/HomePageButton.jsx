'use client'
import React from 'react'
import Link from 'next/link';
import tyingBgPic from '../../public/tying.jpg'
import windingBgPic from '../../public/asu-winding.webp'
import markingBgPic from '../../public/asu-marking.png'
import chittamBgPic from '../../public/chittam.jpeg'
import productBgPic from '../../public/product.jpg'
import clientBgPic from '../../public/client.webp'


const workItems = [
    {
        name: 'Tying / Dyeing',
        purpose: 'Record daily attendance for Tying and Dyeing workers',
        href: '/employees/attendance/tying-dyeing-workers',
        bgUrl: tyingBgPic
    },
    {
        name: 'Asu Winding',
        purpose: 'add Asu Winding tasks for Winding workers',
        href: '/employees/list/asu-winding',
        bgUrl: windingBgPic
    },
    {
        name: 'Asu Marking',
        purpose: 'select product for Marking tasks for Marking workers',
        href: '/employees/list/asu-marking',
        bgUrl: markingBgPic
    },
    {
        name: 'chittam',
        purpose: 'select product for chittam for chittam workers',
        href: '/employees/list/chittam',
        bgUrl: chittamBgPic
    },
];
const other = [
    {
        name: 'Add Product',
        purpose: 'adding new product to product list',
        href: '/products/add',
        bgUrl: productBgPic
    },
    {
        name: 'Clients',
        purpose: 'Handle client related stuff',
        href: '/clients',
        bgUrl: clientBgPic
    },
    {
        name: 'Employees',
        purpose: 'All workers list',
        href: '/employees/list',
        bgUrl: ''
    },
]

const WorkButtons = ({ items }) => items.map((work) => (
    <Link
        key={work.name}
        href={work.href}
        className="relative group aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-border bg-cover bg-center"
        style={{
            backgroundImage: work.bgUrl && `url(${work.bgUrl.src})`,
        }}
    >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-opacity-60 transition"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full text-white px-2">
            <h2 className="text-lg sm:text-xl font-semibold uppercase">{work.name}</h2>
            <p className="text-sm mt-1 opacity-80">{work.purpose}</p>
        </div>
    </Link>
))

const GoToAddEmployee = () => <Link
    key={'add-employee'}
    href='/employees/add'
    className="relative group aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-border  bg-center"

>
    <div className="absolute inset-0 bg-accent bg-opacity-50 group-hover:bg-opacity-60 transition"></div>
    <div className="relative z-10 flex flex-col justify-center items-center text-center h-full text-white px-2">
        <h2 className="text-lg sm:text-xl font-semibold uppercase">Add Employee +</h2>
        <p className="text-sm mt-1 opacity-80"> add new employee to your company</p>
    </div>
</Link>

const HomePageButton = () => {
    return (
        <div className="space-y-4 w-full flex items-center justify-center">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <h2 className='col-span-full text-2xl font-bold'>Assign work</h2>
                <WorkButtons items={workItems} />
                <h2 className='col-span-full text-xl font-bold'>Others</h2>
                <WorkButtons items={other} />
                <GoToAddEmployee />

            </div>

        </div>
    )
}

export default HomePageButton