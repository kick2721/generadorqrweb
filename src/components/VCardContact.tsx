"use client";

import { useState } from "react";

function parseVCard(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  return { name: get("FN"), phone: get("TEL"), email: get("EMAIL") };
}

export default function VCardContact({ vcardRaw }: { vcardRaw: string }) {
  const { name, phone, email } = parseVCard(vcardRaw);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copy = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">Contacto</p>
        <p className="text-xl font-bold mb-4">{name}</p>
        <div className="space-y-3">
          {phone && (
            <a href={`tel:${phone}`}
              className="flex items-center justify-between w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <span>📞 {phone}</span>
              <span className="text-sm font-normal">Llamar →</span>
            </a>
          )}
          {phone && (
            <button onClick={() => copy(phone, setCopiedPhone)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
              {copiedPhone ? "✅ Copiado" : "📋 Copiar teléfono"}
            </button>
          )}
          {email && (
            <a href={`mailto:${email}`}
              className="flex items-center justify-between w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <span>✉️ {email}</span>
              <span className="text-sm font-normal">Enviar →</span>
            </a>
          )}
          {email && (
            <button onClick={() => copy(email, setCopiedEmail)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
              {copiedEmail ? "✅ Copiado" : "📋 Copiar email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
