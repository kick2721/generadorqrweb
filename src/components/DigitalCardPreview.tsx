"use client";

interface DigitalCardProps {
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export function buildVcf(c: DigitalCardProps) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${c.name}`,
    `ORG:${c.company}`,
    `TITLE:${c.title}`,
    `TEL:${c.phone}`,
    `EMAIL:${c.email}`,
    `URL:${c.website}`,
    `ADR:;;${c.address};;;`,
    "END:VCARD",
  ];
  return lines.map(l => l.replace(/\n/g, " ")).join("\n");
}

export default function DigitalCardPreview(c: DigitalCardProps) {
  const hasAny = c.name || c.company || c.title || c.phone || c.email || c.website || c.address;

  function downloadVcf() {
    const vcf = buildVcf(c);
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(c.name || "contacto").replace(/\s+/g, "_")}.vcf`;
    a.click();
  }

  if (!hasAny) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center text-gray-400 text-sm">
        Completa los campos para ver tu tarjeta
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold shrink-0">
          {(c.name || "?").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          {c.name && <p className="font-semibold text-base truncate">{c.name}</p>}
          {c.title && <p className="text-xs text-gray-300 truncate">{c.title}</p>}
          {c.company && <p className="text-xs text-gray-400 truncate">{c.company}</p>}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {c.phone && (
          <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {c.phone}
          </a>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {c.email}
          </a>
        )}
        {c.website && (
          <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            {c.website}
          </a>
        )}
        {c.address && (
          <div className="flex items-start gap-2 text-gray-200">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{c.address}</span>
          </div>
        )}
      </div>
      <button onClick={downloadVcf} className="mt-5 w-full py-2.5 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors active:scale-[0.98]">
        Guardar contacto
      </button>
    </div>
  );
}
