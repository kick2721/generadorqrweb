"use client";
import { useEffect } from "react";

export default function SmsOpener({ number, message, smsHref, qrId }: { number: string; message: string; smsHref: string; qrId: string }) {
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

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const msg = encodeURIComponent(message);
    if (isIOS) {
      window.location.href = `sms:${number}&body=${msg}`;
    } else if (isAndroid) {
      window.location.href = `sms:${number}?body=${msg}`;
    } else {
      window.location.href = smsHref;
    }
  }, [number, message, smsHref, qrId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-4xl mb-4">💬</p>
        <p className="text-lg font-bold mb-2">{number}</p>
        {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}
        <p className="text-sm text-gray-400 mb-4">Abriendo app de mensajes...</p>
        <a href={smsHref} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          💬 Abrir app de mensajes
        </a>
      </div>
    </div>
  );
}
