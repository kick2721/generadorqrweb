import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getCountry(ip: string): Promise<string> {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.")) return "";
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      const data = await res.json();
      return data.country || "";
    }
  } catch {}
  return "";
}

function parseVCard(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  return { name: get("FN"), phone: get("TEL"), email: get("EMAIL") };
}

export default async function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query(`SELECT redirect_to, type FROM public.qrcodes WHERE id = $1`, [id]);
  if (rows.length === 0) redirect("/");

  const qr = rows[0];
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0]?.trim() || h.get("x-real-ip") || "";

  try {
    const countryPromise = getCountry(ip);
    const country = await countryPromise;
    await query(
      `INSERT INTO public.scans (qr_id, ip, user_agent, referrer, country) VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        ip,
        h.get("user-agent") || "",
        h.get("referer") || "",
        country,
      ]
    );
  } catch {}

  if (qr.type === "text") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-purple-600 mb-4">QRGeneradorWeb</p>
          <p className="text-lg text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{qr.redirect_to}</p>
        </div>
      </div>
    );
  }

  if (qr.type === "vcard") {
    const v = parseVCard(qr.redirect_to);
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
          <p className="text-sm font-semibold text-purple-600 mb-4">QRGeneradorWeb — Contacto</p>
          <p className="text-xl font-bold mb-1">{v.name}</p>
          {v.phone && <p className="text-gray-500">📞 {v.phone}</p>}
          {v.email && <p className="text-gray-500">✉️ {v.email}</p>}
        </div>
      </div>
    );
  }

  if (qr.type === "wifi") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-purple-600 mb-4">QRGeneradorWeb — WiFi</p>
          <p className="text-gray-500">Escanea este QR con la cámara de tu teléfono para conectarte a la red WiFi.</p>
        </div>
      </div>
    );
  }

  const dest = qr.redirect_to;
  redirect(dest.startsWith("http") ? dest : `https://${dest}`);
}
