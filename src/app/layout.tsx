import { Toaster } from 'sonner';
export const dynamic = 'force-dynamic';
﻿import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Farvics Manager | Enterprise Financial Intelligence",
  description: "AI-powered financial domain engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-content-primary overflow-hidden`}>
        {/* Deep Space Glow Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-galaxy-red/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-galaxy-purple/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        {children}
        <Toaster theme="dark" toastOptions={{ className: 'bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-xl' }} />
      </body>
    </html>
  );
}


