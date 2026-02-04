import type { Metadata } from "next";
import Navigation from "@/components/common/Header"
import Footer from "@/components/common/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Tinder",
  description: "This is default dev tinder descriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="pt-8 min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" richColors/>
        <Footer />
      </body>
    </html>
  );
}
