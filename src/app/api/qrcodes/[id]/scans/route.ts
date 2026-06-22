import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const qr = await query(`SELECT user_id FROM public.qrcodes WHERE id = $1`, [id]);
  if (qr.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (qr[0].user_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const total = await query(`SELECT COUNT(*)::int AS count FROM public.scans WHERE qr_id = $1`, [id]);

  const daily = await query(
    `SELECT DATE(scanned_at) AS date, COUNT(*)::int AS count
     FROM public.scans WHERE qr_id = $1
     GROUP BY DATE(scanned_at) ORDER BY date DESC LIMIT 30`,
    [id]
  );

  const recent = await query(
    `SELECT scanned_at, ip, country, referrer, user_agent
     FROM public.scans WHERE qr_id = $1
     ORDER BY scanned_at DESC LIMIT 50`,
    [id]
  );

  return NextResponse.json({ total: total[0].count, daily, recent });
}
