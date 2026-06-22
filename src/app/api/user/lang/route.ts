import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { LANGUAGES } from "@/lib/i18n";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { lang } = await req.json();
  if (!LANGUAGES.some((l) => l.code === lang)) {
    return Response.json({ error: "Invalid language" }, { status: 400 });
  }

  await pool.query("UPDATE public.users SET lang = $1 WHERE id = $2", [lang, session.user.id]);
  return Response.json({ ok: true });
}
