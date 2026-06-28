"use client";

interface Props {
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export default function BusinessCardScan(p: Props) {
  const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${p.name}\nORG:${p.company}\nTITLE:${p.title}\nTEL:${p.phone}\nEMAIL:${p.email}\nURL:${p.website}\nADR:;;${p.address};;;\nEND:VCARD`.replace(/\n/g, "\r\n");

  function download() {
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(p.name || "contacto").replace(/\s+/g, "_")}.vcf`;
    a.click();
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold shrink-0">
          {(p.name || "?").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          {p.name && <p className="font-semibold text-base truncate">{p.name}</p>}
          {p.title && <p className="text-xs text-gray-300 truncate">{p.title}</p>}
          {p.company && <p className="text-xs text-gray-400 truncate">{p.company}</p>}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {p.phone && <div className="flex items-center gap-2 text-gray-200"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{p.phone}</div>}
        {p.email && <div className="flex items-center gap-2 text-gray-200"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{p.email}</div>}
        {p.website && <div className="flex items-center gap-2 text-gray-200"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>{p.website}</div>}
        {p.address && <div className="flex items-start gap-2 text-gray-200"><svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>{p.address}</span></div>}
      </div>
      <button onClick={download} className="mt-5 w-full py-2.5 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors active:scale-[0.98]">
        Guardar contacto
      </button>
    </div>
  );
}
