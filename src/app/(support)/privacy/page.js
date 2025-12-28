import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-4xl md:text-5xl font-black text-secondary mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-text mb-12">Last Updated: December 28, 2025</p>

        <div className="space-y-10 text-text-dark leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              1. Information We Collect
            </h2>
            <p className="text-muted-text">
              We collect information that you provide directly to us, such as
              when you create an account, update your profile, or communicate
              with us. This may include:
            </p>
            <ul className="list-disc pl-5 mt-4 text-muted-text space-y-2">
              <li>Name and Contact Information</li>
              <li>Employee Data and Records</li>
              <li>Financial Information for Payroll</li>
              <li>Usage Data and Logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              2. How We Use Information
            </h2>
            <p className="text-muted-text">
              The information we collect is used to provide, maintain, and
              improve our services, including:
            </p>
            <ul className="list-disc pl-5 mt-4 text-muted-text space-y-2">
              <li>Processing payroll and attendance automatically</li>
              <li>Generating reports and analytics</li>
              <li>Providing customer support</li>
              <li>Sending technical notices and security alerts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              3. Data Security
            </h2>
            <p className="text-muted-text">
              We take reasonable measures to help protect information about you
              from loss, theft, misuse and unauthorized access, disclosure,
              alteration and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              4. Contact Us
            </h2>
            <p className="text-muted-text">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <strong className="text-primary">support@dyerhandloom.com</strong>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
