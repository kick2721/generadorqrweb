import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import PasswordGate from "@/components/PasswordGate";
import VCardContact from "@/components/VCardContact";
import PhoneDialer from "@/components/PhoneDialer";
import SmsOpener from "@/components/SmsOpener";
import MapsOpener from "@/components/MapsOpener";

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

function parseSms(text: string) {
  const m = text.match(/^smsto:(.+?):(.+)$/);
  return m ? { phone: m[1], message: m[2] } : { phone: text.replace("smsto:", ""), message: "" };
}

function parseVCalendar(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  const dtstart = get("DTSTART");
  const dateStr = dtstart ? dtstart.replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_, y, m, d, h, min) => {
    return `${y}-${m}-${d}${h ? ` ${h}:${min || "00"}` : ""}`;
  }) : "";
  return { title: get("SUMMARY"), date: dateStr, location: get("LOCATION"), description: get("DESCRIPTION") };
}

async function getScanCount(id: string): Promise<number> {
  try {
    const rows = await query(`SELECT COUNT(*) AS cnt FROM public.scans WHERE qr_id = $1`, [id]);
    return rows[0]?.cnt || 0;
  } catch { return 0; }
}

function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4 text-center">QRWing</p>
        {children}
      </div>
    </div>
  );
}

export default async function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query(`SELECT redirect_to, type, config FROM public.qrcodes WHERE id = $1`, [id]);
  if (rows.length === 0) redirect("/");

  const qr = rows[0];
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0]?.trim() || h.get("x-real-ip") || "";

  if (qr.type !== "sms" && qr.type !== "phone" && qr.type !== "location") {
    try {
      const countryPromise = getCountry(ip);
      const country = await countryPromise;
      await query(
        `INSERT INTO public.scans (qr_id, ip, user_agent, referrer, country)
         SELECT $1, $2, $3, $4, $5
         WHERE NOT EXISTS (
           SELECT 1 FROM public.scans
           WHERE qr_id = $1 AND ip = $2 AND scanned_at > now() - interval '30 seconds'
         )`,
        [
          id,
          ip,
          h.get("user-agent") || "",
          h.get("referer") || "",
          country,
        ]
      );
    } catch {}
  }

  if (qr.type === "text") {
    return (
      <LandingLayout>
        <p className="text-lg text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{qr.redirect_to}</p>
      </LandingLayout>
    );
  }

  if (qr.type === "vcard") {
    return <VCardContact vcardRaw={qr.redirect_to} />;
  }
  if (qr.type === "wifi") {
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">WiFi</p>
        <p className="text-gray-500">Escanea este QR con la cámara de tu teléfono para conectarte a la red WiFi.</p>
      </LandingLayout>
    );
  }

  if (qr.type === "phone") {
    const number = qr.redirect_to.replace("tel:", "");
    return <PhoneDialer number={number} telHref={qr.redirect_to} qrId={id} />;
  }

  if (qr.type === "sms") {
    const s = parseSms(qr.redirect_to);
    return <SmsOpener number={s.phone} message={s.message} smsHref={qr.redirect_to} qrId={id} />;
  }

  if (qr.type === "location") {
    const query = decodeURIComponent(qr.redirect_to.replace("https://maps.google.com/maps?q=", ""));
    return <MapsOpener query={query} qrId={id} />;
  }

  if (qr.type === "calendar") {
    const ev = parseVCalendar(qr.redirect_to);
    const scanCount = await getScanCount(id);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">Evento</p>
        <p className="text-xl font-bold mb-1">{ev.title || "Evento"}</p>
        {ev.date && <p className="text-gray-500 text-sm">📅 {ev.date}</p>}
        {ev.location && <p className="text-gray-500 text-sm">📍 {ev.location}</p>}
        {ev.description && <p className="text-gray-400 text-xs mt-2">{ev.description}</p>}
        <p className="text-xs text-gray-400 mt-4">{scanCount} escaneos</p>
      </LandingLayout>
    );
  }

  const config = typeof qr.config === "string" ? JSON.parse(qr.config) : (qr.config || {});

  if (config?.expiresAt && new Date(config.expiresAt) < new Date()) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-lg font-semibold mb-1">Este QR ha expirado</p>
          <p className="text-sm text-gray-500">El contenido ya no está disponible.</p>
        </div>
      </div>
    );
  }

  if (qr.type === "password") {
    return <PasswordGate config={config} redirectTo={qr.redirect_to} />;
  }

  if (qr.type === "multi-link") {
    const links: { url: string; day?: string; hour?: string }[] = config?.multiLinks || [];
    if (links.length > 0) {
      const now = new Date();
      const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const currentDay = days[now.getDay()];
      const currentHour = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const match = links.find(l => {
        if (l.day && l.day !== currentDay) return false;
        if (l.hour && l.hour > currentHour) return false;
        return true;
      });
      if (match) {
        const u = match.url.startsWith("http") ? match.url : `https://${match.url}`;
        redirect(u);
      }
    }
  }

  const dest = qr.redirect_to;
  const cleanUrl = dest.startsWith("http") ? dest : `https://${dest}`;
  redirect(cleanUrl);
}
