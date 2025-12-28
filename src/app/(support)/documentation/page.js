import React from "react";
import Link from "next/link";
import { FaBookOpen, FaCode, FaCogs, FaDatabase } from "react-icons/fa";

const DocSection = ({ title, items }) => (
  <div className="mb-10">
    <h3 className="text-lg font-bold text-text-dark uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
      {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i}>
          <Link
            href="#"
            className="text-muted-text hover:text-primary hover:translate-x-1 transition-all block py-1"
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-gray-50 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto hidden md:block p-8">
        <div className="flex items-center gap-3 text-secondary font-black text-2xl mb-12">
          <FaBookOpen className="text-primary" />
          <span>Docs</span>
        </div>

        <DocSection
          title="Introduction"
          items={["Welcome", "Architecture Overview", "Core Concepts"]}
        />
        <DocSection
          title="Modules"
          items={[
            "Employee Management",
            "Product Inventory",
            "Wage Calculation",
            "Client Orders",
          ]}
        />
        <DocSection
          title="API Reference"
          items={["Authentication", "Endpoints", "Rate Limits", "Errors"]}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-sm text-primary font-bold uppercase tracking-widest">
            Developer & User Guides
          </div>
          <h1 className="text-5xl font-black text-secondary mb-8">
            Documentation
          </h1>
          <p className="text-xl text-muted-text leading-relaxed mb-12">
            Deep dive into the architecture, features, and implementation
            details of the Dyer Handloom Management System.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-surface border border-primary/10">
              <FaCogs className="text-4xl text-primary mb-6" />
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                Configuration
              </h3>
              <p className="text-muted-text mb-6">
                Learn how to configure the system for your specific handloom
                society needs.
              </p>
              <Link href="#" className="font-bold text-primary hover:underline">
                Read Guide →
              </Link>
            </div>
            <div className="p-8 rounded-3xl bg-surface border border-primary/10">
              <FaDatabase className="text-4xl text-primary mb-6" />
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                Data Management
              </h3>
              <p className="text-muted-text mb-6">
                Best practices for backing up, exporting, and securing your
                critical data.
              </p>
              <Link href="#" className="font-bold text-primary hover:underline">
                Read Guide →
              </Link>
            </div>
          </div>

          <div className="prose prose-lg text-muted-text">
            <h2 className="text-3xl font-bold text-text-dark mb-6">
              Quick Start
            </h2>
            <p className="mb-6">
              The Dyer System is designed to be intuitive. However, setting up
              your master data correctly is crucial for accurate automation.
            </p>
            <pre className="bg-[#1a1b26] p-6 rounded-2xl text-white overflow-x-auto mb-8">
              <code>
                {`
                  # Start the development server
                  npm run dev

                  # Build for production
                  npm run build
                `}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
