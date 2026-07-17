import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { Pool } from "pg";
import { getUserPlan } from "@/lib/plan";
import { SEEDS_BY_KIND } from "@/lib/seed-data";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { blocks, template, fonts } = await req.json();
  if (!blocks) return NextResponse.json({ error: "blocks required" }, { status: 400 });

  const { plan, qrCount, qrLimit } = await getUserPlan();
  if (plan === "free" && qrCount >= qrLimit) {
    return NextResponse.json({ error: "Plan limit reached", plan, qrCount, qrLimit }, { status: 402 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://generadorqrweb.vercel.app";

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const qrResult = await client.query(
      `INSERT INTO public.qrcodes (user_id, type, content, label, config) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [session.user.id, "catalog", "", "", JSON.stringify({ status: "draft" })]
    );
    const qr = qrResult.rows[0];
    const redirectUrl = `${baseUrl}/c/${qr.id}`;
    await client.query(`UPDATE public.qrcodes SET content = $1, redirect_to = $1, label = $2 WHERE id = $3`,
      [redirectUrl, `Catálogo`, qr.id]);

    const seed = template !== "blank" ? SEEDS_BY_KIND[template] : null;
    const initialBlocks = seed ? { categories: seed.categories, info: seed.info, theme: seed.theme } : blocks;

    await client.query(
      `INSERT INTO public.catalog_items (qr_id, blocks, template, fonts) VALUES ($1, $2, $3, $4)`,
      [qr.id, JSON.stringify(initialBlocks), template || "blank", fonts || []]
    );

    await client.query("COMMIT");
    return NextResponse.json({ qrId: qr.id, redirectUrl }, { status: 201 });
  } catch (e) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Failed to create catalog" }, { status: 500 });
  } finally {
    client.release();
  }
}
