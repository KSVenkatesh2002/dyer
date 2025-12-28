import React from "react";
import Link from "next/link";
import {
  FaClipboardList,
  FaArrowRight,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { MdHandyman, MdDesignServices } from "react-icons/md";
import { BsStars } from "react-icons/bs";

// Reusing SectionHeading for consistency
const SectionHeading = ({ children, className = "" }) => (
  <h2
    className={`text-3xl md:text-5xl font-black text-text-dark mb-6 tracking-tight ${className}`}
  >
    {children}
  </h2>
);

// Detailed Step Component
const DetailedStep = ({
  step,
  title,
  description,
  details,
  icon: Icon,
  align = "left",
}) => (
  <div
    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 py-12 ${
      align === "right" ? "md:flex-row-reverse" : ""
    }`}
  >
    {/* Visual Side */}
    <div className="flex-1 w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 transition-transform group-hover:rotate-6 duration-300"></div>
        <div className="relative bg-white border border-primary/10 p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all">
          <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-secondary/20">
            <Icon />
          </div>
          <h3 className="text-2xl font-bold text-text-dark mb-4">{title}</h3>
          <p className="text-muted-text leading-relaxed">{description}</p>
        </div>
      </div>
    </div>

    {/* Content Side */}
    <div className="flex-1 w-full space-y-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl border border-primary/20">
        {step}
      </div>
      <div>
        <h4 className="text-xl font-bold text-text-dark mb-4">
          Key Activities
        </h4>
        <ul className="space-y-3">
          {details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3 text-muted-text">
              <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-orange-200/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline"
            >
              <p>← Back to Home</p>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-primary/20 text-sm font-bold text-primary mb-6 shadow-sm mx-auto">
            <BsStars className="animate-pulse" />
            <span>Workflow Broken Down</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6 leading-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">
              Dyer
            </span>{" "}
            Works
          </h1>
          <p className="text-xl text-muted-text leading-relaxed">
            A step-by-step guide to how our platform streamlines the entire
            handloom manufacturing process.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-12">
          <DetailedStep
            step="01"
            icon={FaBoxOpen}
            title="Product Creation & Orders"
            description="Everything starts with a client order or new inventory requirement. Define technical specifications upfront."
            align="left"
            details={[
              "Register new clients and manage their preferences",
              "Define product specs: border type, color, body design, and fabric",
              "Generate unique Product IDs (QR-ready) for tracking",
            ]}
          />

          <DetailedStep
            step="02"
            icon={MdHandyman}
            title="Task Allocation"
            description="Assign specific manufacturing stages to the right artisans based on their skills and availability."
            align="right"
            details={[
              "Assign Marking (Design layout) tasks",
              "Assign Winding (Prepare Bobbins) task",
              "Set expected completion dates and priority",
              "Track who is working on what in real-time",
            ]}
          />

          <DetailedStep
            step="03"
            icon={FaClipboardList}
            title="Daily Work & Attendance"
            description="Artisans log their work daily. The system automatically calculates attendance based on active jobs."
            align="left"
            details={[
              "Mark daily attendance (Present, Half-Day, Absent)",
              "Log specific output (e.g., 'Completed 5 sarees')",
              "Supervisor verification for quality control",
              "Automatic updating of stock readiness",
            ]}
          />

          <DetailedStep
            step="04"
            icon={FaMoneyBillWave}
            title="Automated Payroll"
            description="No more manual calculations. Wages are generated instantly based on piece-rate or daily work."
            align="right"
            details={[
              "Calculate wages based on completed units or days worked",
              "Manage advances and loan deductions automatically",
              "Generate clear payslips for every artisan",
              "Maintain a transparent financial ledger",
            ]}
          />
        </div>

        {/* CTA Section */}
        <section className="mt-24">
          <div className="bg-secondary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10">
              Ready to modernize your operations?
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
              Join the future of handloom management. Simple, transparent, and
              powerful.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-primary/90 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
