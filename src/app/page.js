import React from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaClipboardList,
  FaUsers,
  FaMoneyBillWave,
  FaCogs,
  FaHistory,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { MdOutlineArchitecture, MdHandyman } from "react-icons/md";
import { BsStars } from "react-icons/bs";

export const metadata = {
  title: "Dyer Handloom Management",
  description: "Track employee work, attendance, and salary",
  keywords: ["handloom", "saala pani", "padmashali", "cheinetha", "dyer"],
  author: "Dyer Handloom Management",
  publisher: "Dyer Handloom Management",
  icons: {
    icon: [
      { url: "/fav_icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/fav_icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/fav_icon/site.webmanifest",
  },
};

// Component for Section Headings
const SectionHeading = ({ children, className = "" }) => (
  <h2
    className={`text-3xl md:text-5xl font-black text-text-dark mb-6 tracking-tight ${className}`}
  >
    {children}
  </h2>
);

// Component for Cards
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm border border-white/50 p-8 rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
      <Icon className="text-2xl text-primary group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-text-dark mb-3">{title}</h3>
    <p className="text-muted-text text-sm leading-relaxed">{description}</p>
  </div>
);

// Component for Step/Flow
const FlowStep = ({ icon: Icon, step, title, description, isLast }) => (
  <div className="relative flex flex-col items-center text-center p-4">
    <div className="w-20 h-20 bg-white border-2 border-primary/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/5 z-10 relative group hover:scale-110 transition-transform duration-300">
      <Icon className="text-3xl text-primary" />
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold text-white border-4 border-white">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-bold text-text-dark mb-2">{title}</h3>
    <p className="text-muted-text text-sm max-w-[200px] mx-auto">
      {description}
    </p>

    {/* Line connector for desktop */}
    {!isLast && (
      <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/20 to-transparent -z-10" />
    )}
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF7] selection:bg-primary/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-200/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center py-24 relative">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-primary/20 text-sm font-bold text-primary mb-8 shadow-sm animate-fade-in-up hover:bg-primary/5 transition-colors cursor-default">
            <BsStars className="animate-pulse" />
            <span>The Future of Traditional Weaving</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-secondary mb-8 leading-[1.1]">
            Dyer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">
              Handloom
            </span>{" "}
            <br />
            Management
          </h1>

          <p className="text-xl md:text-2xl text-muted-text font-medium mb-4 max-w-3xl mx-auto leading-relaxed">
            Digitizing traditional workflows without losing their soul.
          </p>
          <p className="text-sm md:text-base text-muted-text/80 max-w-2xl mx-auto mb-12 uppercase tracking-widest font-bold">
            Employee Tracking • Product Design • Automated Wages
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 transition-all hover:scale-105 hover:shadow-2xl hover:bg-secondary/90 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Enter Workspace{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white border-2 border-transparent hover:border-primary/10 text-text-dark font-bold rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:bg-gray-50 transition-all w-full sm:w-auto">
              How it works
            </button>
          </div>
        </section>

        {/* BRAND PROMISE SECTION */}
        <section className="py-20">
          <div className="bg-secondary rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

            <MdHandyman className="absolute top-10 right-10 text-9xl text-white opacity-5 rotate-12" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Built for Handloom,
                  <br />
                  Not Generic Factories
                </h2>
                <div className="space-y-6 text-lg text-white/80">
                  <p className="leading-relaxed">
                    Most software ignores how traditional handloom work actually
                    functions. We built this platform around real processes like{" "}
                    <span className="text-primary font-bold">winding</span>,{" "}
                    <span className="text-yellow-400 font-bold">marking</span>,
                    and attendance-based wages.
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      "No shortcuts taken",
                      "Native workflow support",
                      "Transparent Calculations",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-white font-bold"
                      >
                        <div className="p-1 rounded-full bg-primary text-white">
                          <FaCheckCircle className="text-sm" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Glass Card visualizing the UI concept */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-700">
                  <div className="flex items-center gap-4 mb-6 opacity-80">
                    <div className="w-10 h-10 rounded-full bg-primary/80" />
                    <div className="flex-1 h-3 bg-white/20 rounded-full" />
                    <div className="w-20 h-3 bg-white/20 rounded-full" />
                  </div>
                  <div className="space-y-3 opacity-60">
                    <div className="h-20 bg-white/10 rounded-xl w-full" />
                    <div className="h-20 bg-white/10 rounded-xl w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (FLOW SECTION) */}
        <section className="py-24">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h3 className="text-primary font-bold tracking-widest uppercase mb-2">
              Workflow
            </h3>
            <SectionHeading>From Order to Payment</SectionHeading>
            <p className="text-muted-text text-lg">
              Managing the lifecycle of a saree has never been this intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative px-4">
            <FlowStep
              icon={FaClipboardList}
              step="1"
              title="Create Product"
              description="Register client orders with design specifications."
            />
            <FlowStep
              icon={MdHandyman}
              step="2"
              title="Assign Tasks"
              description="Allocate winding and marking work to artisans."
            />
            <FlowStep
              icon={FaCheckCircle}
              step="3"
              title="Track Work"
              description="Monitor task progress and daily attendance."
            />
            <FlowStep
              icon={FaMoneyBillWave}
              step="4"
              title="Manage Payments"
              description="Record payments with full transparency."
              isLast={true}
            />
          </div>
        </section>

        {/* CORE FEATURES SECTION */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-lg font-bold text-muted-text mb-2 uppercase tracking-wider">
              Features at a Glance
            </h3>
            <SectionHeading>Everything Connected</SectionHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={FaUsers}
              title="Employee Management"
              description="Manage artisans based on real job types and skillsets efficiently."
            />
            <FeatureCard
              icon={FaCogs}
              title="Task Assignment"
              description="Product-based task assignment optimized for complex handloom workflows."
            />
            <FeatureCard
              icon={FaHistory}
              title="Attendance & Wages"
              description="Automated daily attendance tracking and wage calculation."
            />
            <FeatureCard
              icon={FaMoneyBillWave}
              title="Payment History"
              description="Maintain detailed ledgers of all payments and dues."
            />
            <FeatureCard
              icon={FaShieldAlt}
              title="Secure System"
              description="Role-based access ensures data security and integrity."
            />
            <FeatureCard
              icon={MdOutlineArchitecture}
              title="Scalable Design"
              description="Built to scale with your growing inventory and workforce."
            />
          </div>
        </section>

        {/* CLOSING STATEMENT & FOOTER */}
        <section className="py-24 text-center mt-10 relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
          <h2 className="text-4xl md:text-5xl font-black text-secondary mb-8 max-w-4xl mx-auto leading-tight">
            Preserving craft through clarity, structure, and thoughtful
            software.
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 bg-secondary text-white font-bold text-lg rounded-2xl hover:bg-secondary/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Start Managing Work <FaArrowRight />
          </Link>
        </section>
      </div>
    </div>
  );
}
