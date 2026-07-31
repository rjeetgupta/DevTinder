import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "DevTinder",
  description: "Connect with developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
