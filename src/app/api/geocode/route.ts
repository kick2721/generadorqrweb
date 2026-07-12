import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPlan } from "@/lib/plan";
import { canUse, increment, geocodeCacheGet, geocodeCacheSet } from "@/lib/geo-quota";

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// Simple in-memory IP rate limit (cleared on restart)
const ipLimits = new Map<string, number[]>();

function checkIpLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 10;
  const timestamps = (ipLimits.get(ip) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  ipLimits.set(ip, timestamps);
  return true;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "authentication required" }, { status: 401 });
  }

  const { plan } = await getUserPlan();
  if (plan !== "pro") {
    return NextResponse.json({ error: "Pro plan required" }, { status: 402 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!checkIpLimit(ip)) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const q = (body.q ?? "").trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ error: "query must be at least 3 characters" }, { status: 400 });
  }

  const cacheKey = q.toLowerCase();
  const cached = geocodeCacheGet(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY_SERVER;
  if (!apiKey) {
    return NextResponse.json({ error: "geocoding not configured" }, { status: 503 });
  }

  if (!(await canUse("geocoding"))) {
    return NextResponse.json(
      { error: "geocoding temporarily unavailable — monthly limit reached" },
      { status: 503 }
    );
  }

  try {
    const url = `${GOOGLE_GEOCODE_URL}?key=${apiKey}&address=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      return NextResponse.json({ error: "location not found" }, { status: 404 });
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;
    const name = result.formatted_address;

    await increment("geocoding");

    const out = { lat, lng, name };
    geocodeCacheSet(cacheKey, out);

    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ error: "geocoding service error" }, { status: 502 });
  }
}
