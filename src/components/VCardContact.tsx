"use client";

function parseVCard(text: string) {
  const get = (k: string) => {
  const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  return { name: get("FN"), phone: get("TEL"), email: get("EMAIL") };
}

export default function VCardContact({ vcardRaw }: { vcardRaw: string }) {
  const { name, phone, email } = parseVCard(vcardRaw);

  const handleAddContact = async () => {
    try {
      const blob = new Blob([vcardRaw], { type: "text/vcard;charset=utf-8" });
      const file = new File([blob], "contacto.vcf", { type: "text/vcard" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "", files: [file] });
        return;
      }
    } catch {}
    window.location.href = "data:text/x-vcard;charset=utf-8," + encodeURIComponent(vcardRaw);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">Contacto</p>
        <p className="text-xl font-bold mb-1">{name}</p>
        {phone && <p className="text-gray-500">📞 {phone}</p>}
        {email && <p className="text-gray-500">✉️ {email}</p>}
        <button onClick={handleAddContact}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
          📇 Agregar a Contactos
        </button>
      </div>
    </div>
  );
}
