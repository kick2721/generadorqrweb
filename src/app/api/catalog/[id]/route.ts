import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

function parseData(raw: any) {
  if (!raw) return { categories: [], info: null, theme: null };
  if (Array.isArray(raw)) return { categories: raw, info: null, theme: null };
  return {
    categories: raw.categories || [],
    info: raw.info || null,
    theme: raw.theme || null,
  };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rows = await query(
    `SELECT ci.*, q.config FROM public.catalog_items ci JOIN public.qrcodes q ON q.id = ci.qr_id WHERE ci.qr_id = $1`,
    [id]
  );
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const r = rows[0];
  const { categories, info, theme } = parseData(r.blocks);
  return NextResponse.json({
    categories,
    info,
    theme,
    template: r.template,
    fonts: r.fonts,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const qrRows = await query(`SELECT user_id FROM public.qrcodes WHERE id = $1`, [id]);
  if (qrRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (qrRows[0].user_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { categories, template, fonts, info, theme } = await req.json();

  const payload = { categories: categories || [], info: info || null, theme: theme || null };

  await query(
    `UPDATE public.catalog_items SET blocks = $1, template = $2, fonts = $3, updated_at = now() WHERE qr_id = $4`,
    [JSON.stringify(payload), template || "restaurant", fonts || [], id]
  );

  return NextResponse.json({ ok: true });
}
