import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const { qrId } = await req.json();
  if (!qrId) return NextResponse.json({ error: "qrId required" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";
  const country = await getCountry(ip);

  try {
    await query(
      `INSERT INTO public.scans (qr_id, ip, user_agent, referrer, country)
       SELECT $1, $2, $3, $4, $5
       WHERE NOT EXISTS (
         SELECT 1 FROM public.scans
         WHERE qr_id = $1 AND ip = $2 AND scanned_at > now() - interval '30 seconds'
       )`,
      [qrId, ip, ua, referrer, country]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
