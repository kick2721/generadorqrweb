import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { folder } = await req.json();

  const rows = await query(
    `UPDATE public.qrcodes SET config = jsonb_set(COALESCE(config, '{}'), '{folder}', to_jsonb($1::text)) WHERE id = $2 AND user_id = $3 RETURNING id`,
    [folder || "", id, session.user.id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
