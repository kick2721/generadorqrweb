"use client";

import { useState, useRef, useEffect } from "react";
import DigitalCardPreview, { buildVcf } from "@/components/DigitalCardPreview";
import Link from "next/link";
import QRCodeStyling from "qr-code-styling";

export default function TarjetaDigitalPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const instRef = useRef<any>(null);

  const card = { name, company, title, phone, email, website, address };
  const hasName = name.trim().length > 0;

  useEffect(() => {
    if (!qrRef.current) return;
    const vcf = buildVcf(card);
    const opts = {
      width: 180, height: 180, data: vcf || " ",
      qrOptions: { errorCorrectionLevel: "L" as const },
      dotsOptions: { type: "square" as const, color: "#111827" },
      cornersSquareOptions: { type: "square" as const, color: "#111827" },
      cornersDotOptions: { type: "square" as const, color: "#111827" },
      backgroundOptions: { color: "#ffffff" },
    };
    if (!instRef.current) {
      instRef.current = new QRCodeStyling(opts);
      instRef.current.append(qrRef.current);
    } else {
      instRef.current.update(opts);
    }
  }, [card]);

  function downloadQR() {
    if (!instRef.current) return;
    instRef.current.download({ name: `tarjeta-${name || "contacto"}`, extension: "png" });
  }

  function downloadVcf() {
    const vcf = buildVcf(card);
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(name || "contacto").replace(/\s+/g, "_")}.vcf`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <header className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </Link>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Tarjeta Digital</h1>
          <p className="text-gray-500 mt-2">Crea tu tarjeta de presentación digital y compártela con un QR</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="text" placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="text" placeholder="Cargo" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="url" placeholder="Sitio web" value={website} onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            <input type="text" placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          </div>
          <div className="space-y-6">
            <DigitalCardPreview {...card} />
            {hasName && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-3">QR de tu tarjeta</p>
                <div ref={qrRef} className="flex justify-center" />
                <div className="flex gap-2 mt-4">
                  <button onClick={downloadQR} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors active:scale-[0.98]">
                    Descargar QR
                  </button>
                  <button onClick={downloadVcf} className="flex-1 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors active:scale-[0.98]">
                    Descargar .vcf
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
