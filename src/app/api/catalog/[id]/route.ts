import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const rows = await query(
    `SELECT ci.* FROM public.catalog_items ci JOIN public.qrcodes q ON q.id = ci.qr_id WHERE ci.qr_id = $1`,
    [id]
  );
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const catalog = rows[0];
  return NextResponse.json({
    blocks: catalog.blocks,
    template: catalog.template,
    fonts: catalog.fonts,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const qrRows = await query(`SELECT user_id FROM public.qrcodes WHERE id = $1`, [id]);
  if (qrRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (qrRows[0].user_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { blocks, template, fonts } = await req.json();

  await query(
    `UPDATE public.catalog_items SET blocks = $1, template = $2, fonts = $3, updated_at = now() WHERE qr_id = $4`,
    [JSON.stringify(blocks || []), template || "blank", fonts || [], id]
  );

  return NextResponse.json({ ok: true });
}
