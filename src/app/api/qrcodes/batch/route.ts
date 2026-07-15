import { auth } from "@/lib/auth";
import { del } from "@vercel/blob";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

const BLOB_REGEX = /blob\.vercel-storage\.com\//;

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }

  const rows = await query(
    `DELETE FROM public.qrcodes WHERE id = ANY($1::uuid[]) AND user_id = $2 RETURNING id, redirect_to, content`,
    [ids, session.user.id]
  );

  for (const qr of rows) {
    if (qr.redirect_to && BLOB_REGEX.test(qr.redirect_to)) {
      try { await del(qr.redirect_to); } catch { }
    }
    if (qr.content && qr.content !== qr.redirect_to && BLOB_REGEX.test(qr.content)) {
      try { await del(qr.content); } catch { }
    }
  }

  return NextResponse.json({ deleted: rows.length });
}
