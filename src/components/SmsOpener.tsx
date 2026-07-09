"use client";
import { useEffect } from "react";

export default function SmsOpener({ number, message, smsHref }: { number: string; message: string; smsHref: string }) {
  useEffect(() => {
    window.location.href = smsHref;
  }, [smsHref]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-4xl mb-4">💬</p>
        <p className="text-lg font-bold mb-2">{number}</p>
        {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}
        <p className="text-sm text-gray-400">Abriendo app de mensajes...</p>
      </div>
    </div>
  );
}
