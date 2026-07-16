import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageShell from "@/components/PageShell";
import CookieBanner from "@/components/CookieBanner";
import { LangProvider } from "@/context/LangContext";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import DashboardPrefetcher from "@/components/DashboardPrefetcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRWing — Professional QR Code Generator",
  description:
    "Create free QR codes with custom colors and logo. Dynamic QR codes with analytics for professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
        <SessionProvider>
          <LangProvider>
            <PageShell>
              <DashboardPrefetcher />
              <main className="flex-1">{children}</main>
              <CookieBanner />
            </PageShell>
          </LangProvider>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
