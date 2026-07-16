"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = pathname.startsWith("/catalog/") || pathname.startsWith("/c/");

  if (isBare) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
