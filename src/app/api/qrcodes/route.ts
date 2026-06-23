import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { getUserPlan } from "@/lib/plan";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, qrCount, qrLimit } = await getUserPlan();

  const rows = await query(
    `SELECT q.*, COALESCE(s.scan_count, 0) AS scan_count
     FROM public.qrcodes q
     LEFT JOIN (SELECT qr_id, COUNT(*) AS scan_count FROM public.scans GROUP BY qr_id) s ON s.qr_id = q.id
     WHERE q.user_id = $1
     ORDER BY q.created_at DESC`,
    [session.user.id]
  );

  return NextResponse.json({ qrcodes: rows, plan, qrCount, qrLimit });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, content, label, config, redirect_to } = await req.json();
  if (!type || !content) return NextResponse.json({ error: "type and content required" }, { status: 400 });

  const { plan, qrCount, qrLimit } = await getUserPlan();
  if (plan === "free" && qrCount >= qrLimit) {
    return NextResponse.json({ error: "Plan limit reached", plan, qrCount, qrLimit }, { status: 402 });
  }

  const actualContent = redirect_to || content;

  const rows = await query(
    `INSERT INTO public.qrcodes (user_id, type, content, label, config, redirect_to) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [session.user.id, type, content, label || "", JSON.stringify(config || {}), plan === "pro" ? actualContent : null]
  );

  const qr = rows[0];

  if (plan === "pro") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://qrwing.vercel.app";
    const redirectUrl = `${baseUrl}/r/${qr.id}`;
    await query(`UPDATE public.qrcodes SET content = $1 WHERE id = $2`, [redirectUrl, qr.id]);
    return NextResponse.json({ ...qr, content: redirectUrl, redirect_to: actualContent }, { status: 201 });
  }

  return NextResponse.json({ ...qr, content: actualContent, redirect_to: null }, { status: 201 });
}
