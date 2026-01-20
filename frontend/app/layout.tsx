"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/common/header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/common/footer";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import SkipNav from "@/components/common/SkipNav";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideFooter = pathname.startsWith("/dashboard") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="AI-powered recruitment engine that reads resumes like a human, but at machine speed." />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SkipNav />
            {!hideFooter && <Header />}
            <main id="main-content" role="main">
              {children}
            </main>
            {!hideFooter && <Footer />}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
