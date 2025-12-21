import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-surface pt-16 pb-8 mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Dyer Handloom</h3>
            <p className="text-surface/80 text-sm leading-relaxed">
              Digitizing traditional handloom workflows. distinct craftsmanship
              meets modern management for a seamless production cycle.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialLink href="#" icon={FaFacebookF} />
              <SocialLink href="#" icon={FaTwitter} />
              <SocialLink href="#" icon={FaInstagram} />
              <SocialLink href="#" icon={FaLinkedinIn} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/clients">Clients</FooterLink>
              <FooterLink href="/products">Products</FooterLink>
              <FooterLink href="/employees">Employees</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/documentation">Documentation</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-surface/80">
                <FaMapMarkerAlt className="text-primary text-lg shrink-0 mt-0.5" />
                <span>
                  12-3-456, Handloom Street,
                  <br />
                  Sircilla, Telangana - 505301
                </span>
              </li>
              <li className="flex items-center gap-3 text-surface/80">
                <FaPhone className="text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-surface/80">
                <FaEnvelope className="text-primary" />
                <span>support@dyerhandloom.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-surface/60">
          <p>© {currentYear} Dyer Handloom Management. All rights reserved.</p>
          <p>
            Designed with <span className="text-primary">♥</span> for the
            Weaving Community.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center text-surface hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
  >
    <Icon />
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="text-surface/70 hover:text-primary transition-colors flex items-center gap-2 group"
    >
      <span className="w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-2"></span>
      {children}
    </Link>
  </li>
);

export default Footer;
