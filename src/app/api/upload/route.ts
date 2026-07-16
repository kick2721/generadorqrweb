import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPlan } from "@/lib/plan";
import { getSupabase } from "@/lib/supabase";

const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/gif": "gif",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await getUserPlan();
  if (plan !== "pro") return NextResponse.json({ error: "Pro plan required" }, { status: 402 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

  const ext = ALLOWED_MIME[file.type];
  if (!ext) return NextResponse.json({ error: "Invalid file type (png, jpeg, gif, webp only)" }, { status: 400 });

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json({ error: "Storage service unavailable" }, { status: 503 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `uploads/${session.user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage.from("catalog-images").upload(name, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("catalog-images").getPublicUrl(data.path);
  return NextResponse.json({ url: urlData.publicUrl });
}
