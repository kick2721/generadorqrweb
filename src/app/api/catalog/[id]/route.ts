import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rows = await query(
    `SELECT ci.*, q.config FROM public.catalog_items ci JOIN public.qrcodes q ON q.id = ci.qr_id WHERE ci.qr_id = $1`,
    [id]
  );
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const r = rows[0];
  const config = typeof r.config === "string" ? JSON.parse(r.config) : (r.config || {});
  return NextResponse.json({
    blocks: r.blocks,
    template: r.template,
    fonts: r.fonts,
    theme: config.theme || "claro",
    accent: config.accent || "",
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const qrRows = await query(`SELECT user_id, config FROM public.qrcodes WHERE id = $1`, [id]);
  if (qrRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (qrRows[0].user_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { blocks, template, fonts, theme, accent } = await req.json();

  const oldConfig = typeof qrRows[0].config === "string" ? JSON.parse(qrRows[0].config) : (qrRows[0].config || {});
  const newConfig = { ...oldConfig, theme: theme || "claro", accent: accent || "" };

  await query(
    `UPDATE public.catalog_items SET blocks = $1, template = $2, fonts = $3, updated_at = now() WHERE qr_id = $4`,
    [JSON.stringify(blocks || []), template || "blank", fonts || [], id]
  );
  await query(`UPDATE public.qrcodes SET config = $1 WHERE id = $2`, [JSON.stringify(newConfig), id]);

  return NextResponse.json({ ok: true });
}
