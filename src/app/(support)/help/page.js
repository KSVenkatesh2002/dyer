import React from "react";
import Link from "next/link";
import { FaSearch, FaQuestionCircle, FaBook, FaHeadset } from "react-icons/fa";

const HelpCategory = ({ icon: Icon, title, description, links }) => (
  <div className="bg-white p-8 rounded-3xl shadow-lg border border-primary/5 hover:border-primary/20 transition-all hover:shadow-xl group">
    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
      <Icon />
    </div>
    <h3 className="text-xl font-bold text-text-dark mb-3">{title}</h3>
    <p className="text-muted-text text-sm mb-6">{description}</p>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href="#"
            className="text-primary text-sm font-semibold hover:underline flex items-center gap-2"
          >
            • {link}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Hero Section */}
      <div className="bg-secondary pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
            Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8">
            How can we help you?
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for articles, guides, or troubleshooting..."
              className="w-full px-6 py-5 pl-14 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white focus:text-text-dark focus:placeholder-muted-text shadow-2xl transition-all"
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 text-xl" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HelpCategory
            icon={FaBook}
            title="Getting Started"
            description="New to Dyer? Learn the basics of setting up your workspace."
            links={[
              "Account Setup Guide",
              "Adding your first Employee",
              "Understanding the Dashboard",
            ]}
          />
          <HelpCategory
            icon={FaQuestionCircle}
            title="Troubleshooting"
            description="Facing issues? Find solutions to common problems."
            links={[
              "Login issues",
              "Data not syncing",
              "Exporting reports errors",
            ]}
          />
          <HelpCategory
            icon={FaHeadset}
            title="Support"
            description="Need direct assistance? Contact our support team."
            links={["Contact Support", "Feature Request", "Report a Bug"]}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <h2 className="text-3xl font-bold text-text-dark text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            "How do I reset my password?",
            "Can I manage multiple organizations?",
            "How are wages calculated?",
            "Is my data secure?",
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group"
            >
              <span className="font-semibold text-text-dark group-hover:text-primary transition-colors">
                {faq}
              </span>
              <span className="text-2xl text-primary/50">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
