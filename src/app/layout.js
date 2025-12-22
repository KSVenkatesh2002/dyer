// app/layout.js

import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SideBar from "@/components/layout/SideBar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Dyer Working Log",
  description: "Track employee work, attendance, and salary",
  icons: {
    icon: "/fav_icon/favicon-16x16.png",
    icon: [
      { url: "/fav_icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/fav_icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/fav_icon/site.webmanifest",
  },
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-surface text-text-dark min-h-screen  ">
          <Header />
          <div className="min-h-[calc(100vh-120px)] flex justify-between">
            <SideBar className="md:min-w-[250px] md:max-w-[250px] md:w-[250px]" />
            <div className="w-full">{children}</div>
          </div>
          <ToastContainer position="top-right" autoClose={2000} />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
