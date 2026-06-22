import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await query(
    `SELECT q.*, COALESCE(s.scan_count, 0) AS scan_count
     FROM public.qrcodes q
     LEFT JOIN (SELECT qr_id, COUNT(*) AS scan_count FROM public.scans GROUP BY qr_id) s ON s.qr_id = q.id
     WHERE q.user_id = $1
     ORDER BY q.created_at DESC`,
    [session.user.id]
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, content, label, config } = await req.json();
  if (!type || !content) return NextResponse.json({ error: "type and content required" }, { status: 400 });

  const rows = await query(
    `INSERT INTO public.qrcodes (user_id, type, content, label, config) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [session.user.id, type, content, label || "", JSON.stringify(config || {})]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
