import { NextResponse } from "next/server";
import { getStatus, geocodeCacheSize } from "@/lib/geo-quota";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (userEmail !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const status = await getStatus();
  return NextResponse.json({
    ...status,
    cache_hits: 0,
    cache_size: geocodeCacheSize(),
  });
}
