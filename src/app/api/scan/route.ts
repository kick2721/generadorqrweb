import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { qrId } = await req.json();
  if (!qrId) return NextResponse.json({ error: "qrId required" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";

  try {
    await query(
      `INSERT INTO public.scans (qr_id, ip, user_agent, referrer) VALUES ($1, $2, $3, $4)`,
      [qrId, ip, ua, referrer]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
