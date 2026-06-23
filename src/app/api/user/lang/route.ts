import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { LANGUAGES } from "@/lib/i18n";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lang } = await req.json();
  if (!LANGUAGES.some((l) => l.code === lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  await query("UPDATE public.users SET lang = $1 WHERE id = $2", [lang, session.user.id]);
  return NextResponse.json({ ok: true });
}
