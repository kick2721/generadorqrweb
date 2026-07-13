import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.")) {
    return NextResponse.json({ error: "local ip" }, { status: 404 });
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.lat != null && data.lon != null) {
      return NextResponse.json({ lat: data.lat, lon: data.lon });
    }
  } catch {}
  return NextResponse.json({ error: "not found" }, { status: 404 });
}
