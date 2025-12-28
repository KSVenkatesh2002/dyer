import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-4xl md:text-5xl font-black text-secondary mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-text mb-12">Last Updated: December 28, 2025</p>

        <div className="space-y-10 text-text-dark leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-text">
              By accessing and using the Dyer Handloom Management System, you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              2. Use License
            </h2>
            <p className="text-muted-text mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Dyer Handloom&apos;s
              website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-5 text-muted-text space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose;</li>
              <li>Attempt to decompile or reverse engineer any software;</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              3. Disclaimer
            </h2>
            <p className="text-muted-text">
              The materials on Dyer Handloom&apos;s website are provided on an
              &apos;as is&apos; basis. Dyer Handloom makes no warranties,
              expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or
              conditions of merchantability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              4. Limitations
            </h2>
            <p className="text-muted-text">
              In no event shall Dyer Handloom or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Dyer Handloom&apos;s website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
