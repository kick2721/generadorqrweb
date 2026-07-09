"use client";
import { useEffect } from "react";

export default function PhoneDialer({ number, telHref, qrId }: { number: string; telHref: string; qrId: string }) {
  useEffect(() => {
    const key = `scan_${qrId}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId }),
      }).catch(() => {});
    }

    window.location.href = telHref;
  }, [telHref, qrId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-4xl mb-4">📞</p>
        <p className="text-lg font-bold mb-2">{number}</p>
        <p className="text-sm text-gray-500">Abriendo app de llamadas...</p>
      </div>
    </div>
  );
}
