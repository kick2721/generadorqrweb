"use client";

import { useEffect, useRef } from "react";

function parseVCard(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  return { name: get("FN"), phone: get("TEL"), email: get("EMAIL") };
}

export default function VCardContact({ vcardRaw }: { vcardRaw: string }) {
  const { name, phone, email } = parseVCard(vcardRaw);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const blob = new Blob([vcardRaw], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacto.vcf";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, [vcardRaw]);

  const handleDownload = () => {
    if (blobUrlRef.current) {
      const a = document.createElement("a");
      a.href = blobUrlRef.current;
      a.download = "contacto.vcf";
      a.click();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4 text-center">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">Contacto</p>
        <p className="text-xl font-bold mb-1">{name}</p>
        {phone && <p className="text-gray-500">📞 {phone}</p>}
        {email && <p className="text-gray-500">✉️ {email}</p>}
        <button onClick={handleDownload}
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors mb-3">
          📇 Agregar a Contactos
        </button>
        <p className="text-xs text-gray-400">Si no se abre automáticamente, toca el botón</p>
      </div>
    </div>
  );
}
