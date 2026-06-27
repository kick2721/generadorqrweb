"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "generadorqr-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "dismissed");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3">
      <div className="max-w-4xl mx-auto flex items-center gap-3 text-xs sm:text-sm">
        <p className="text-gray-500 dark:text-gray-400 flex-1 text-center sm:text-left">
          Usamos cookies esenciales para que el sitio funcione.{" "}
          <a href="/privacy" className="underline text-purple-600 hover:text-purple-700">Más info</a>.
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-xs font-medium transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
