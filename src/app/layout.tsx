import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Signup Flow Builder",
  description: "Visual editor for Typing.com signup flows",
};

import { Suspense } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans`}>
        <Suspense fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }>
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </body>
    </html>
  );
}
