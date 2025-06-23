// app/layout.js

import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { ClerkProvider } from '@clerk/nextjs';



export const metadata = {
    title: 'Dyer Working Log',
    description: 'Track employee work, attendance, and salary',
};

export default async function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className=" bg-surface/40 text-text max-w-lvh mx-auto">
                    <Header />

                    <main className=" min-h-[calc(100vh-64px)] ">
                        {children}
                    </main>
                    <ToastContainer position="top-right" autoClose={2000} />
                </body>
            </html>
        </ClerkProvider>
    );
}

