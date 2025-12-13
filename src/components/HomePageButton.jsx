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

const WorkButtons = ({ items }) => <section className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8'>
  {
    items.map((work) => (
      <Link
        key={work.name}
        href={work.href}
        className="
        w-full 
        relative group rounded-2xl overflow-hidden 
        shadow-lg shadow-black/10 border-2 border-orange-600 
        bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex  
      "
      >
        {/* Background */}
        <div
          className="bg-cover bg-center opacity-90 group-hover:opacity-100 transition-all duration-300 flex-2"
          style={{
            backgroundImage: work.bgUrl && `url(${work.bgUrl.src})`,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full p-5 flex-3">
          <h2 className="sm:text-xl font-semibold uppercase tracking-wide text-white drop-shadow-md">
            {work.name}
          </h2>
          <p className="text-sm text-gray-200 mt-1 opacity-90">{work.purpose}</p>
        </div>
      </Link>
    ))
  }
</section>

const GoToAddEmployee = () => (
  <Link
    href="/employees/add"
    className="
      relative group rounded-2xl overflow-hidden 
      shadow-lg shadow-black/10 border border-gray-200 
      bg-gradient-to-br from-orange-500 to-orange-600
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300
    "
  >
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>

    <div className="relative z-10 flex flex-col justify-center items-center text-center h-full p-5 text-white">
      <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-wide">
        Add Employee +
      </h2>
      <p className="text-sm mt-1 opacity-90">Add new employee to your company</p>
    </div>
  </Link>
)

const HomePageButton = () => {
  return (
    <div className="w-full mx-auto py-10">

        {/* Heading */}
        <h2 className="col-span-full text-3xl font-bold text-orange-600 mb-2">
          Assign Work
        </h2>

        {/* Work Buttons */}
        <WorkButtons items={workItems} />

        <h2 className="col-span-full text-2xl font-semibold text-orange-600 mt-6">
          Other Actions
        </h2>

        {/* Other Buttons */}
        <WorkButtons items={other} />

        {/* Add Employee Button */}
        <GoToAddEmployee />
    </div>
  )
}


export default HomePageButton