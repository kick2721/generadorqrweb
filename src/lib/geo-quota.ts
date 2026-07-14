import { JWT } from "google-auth-library";
import { query } from "./db";

export const SKUS = ["geocoding", "autocomplete", "maps"] as const;
export type Sku = (typeof SKUS)[number];

// Google Essentials: 10,000 free/month per SKU
// Circuit breaker activates at 80% (8,000)
export const SKU_LIMITS: Record<Sku, number> = {
  geocoding: 10000,
  autocomplete: 10000,
  maps: 10000,
};

// Google Cloud service names for Maps Platform
const GOOGLE_SERVICES: Record<Sku, string> = {
  geocoding: "geocoding-backend.googleapis.com",
  autocomplete: "places-backend.googleapis.com",
  maps: "maps-backend.googleapis.com",
};

const THRESHOLD_RATIO = 0.8;

// In-memory cache: { data: sku->usage, ts: timestamp }
let quotaCache: { data: Record<Sku, number> | null; ts: number } = { data: null, ts: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getThreshold(limit: number): number {
  return Math.floor(limit * THRESHOLD_RATIO);
}

export function isOverThreshold(used: number, limit: number): boolean {
  return used >= getThreshold(limit);
}

export async function increment(sku: Sku): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await query(
      `INSERT INTO public.api_usage (usage_date, sku, count)
       VALUES ($1, $2, 1)
       ON CONFLICT (usage_date, sku)
       DO UPDATE SET count = public.api_usage.count + 1`,
      [today, sku]
    );
    console.log(`[geo-quota] increment ${sku} → daily total updated`);
  } catch (err) {
    console.error(`[geo-quota] increment ${sku} failed:`, err);
  }
}

function getCredentials(): { client_email: string; private_key: string; project_id: string } | null {
  const b64 = process.env.GOOGLE_CLOUD_CREDENTIALS_B64;
  if (!b64) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString());
  } catch {
    return null;
  }
}

async function fetchMonthlyUsageForService(serviceName: string): Promise<number> {
  const creds = getCredentials();
  if (!creds) throw new Error("GOOGLE_CLOUD_CREDENTIALS_B64 not configured");

  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDay = now.toISOString();

  const params = new URLSearchParams({
    filter: `metric.type="serviceruntime.googleapis.com/api/request_count" AND resource.labels.service="${serviceName}"`,
    "interval.startTime": firstDay,
    "interval.endTime": endDay,
    "aggregation.alignmentPeriod": "86400s",
    "aggregation.perSeriesAligner": "ALIGN_SUM",
    "aggregation.crossSeriesReducer": "REDUCE_SUM",
  });

  const url = `https://monitoring.googleapis.com/v3/projects/${creds.project_id}/timeSeries?${params}`;
  const res = await client.request({ url });
  const data = res.data as any;

  if (!data.timeSeries || data.timeSeries.length === 0) return 0;

  let total = 0;
  for (const ts of data.timeSeries) {
    for (const point of ts.points || []) {
      const v = point.value?.int64Value ?? point.value?.doubleValue ?? 0;
      total += Number(v);
    }
  }

  return total;
}

async function refreshQuotaCache(): Promise<void> {
  try {
    const entries = await Promise.all(
      SKUS.map(async (sku) => {
        const used = await fetchMonthlyUsageForService(GOOGLE_SERVICES[sku]);
        return [sku, used] as const;
      })
    );
    quotaCache = {
      data: Object.fromEntries(entries) as Record<Sku, number>,
      ts: Date.now(),
    };
    console.log("[geo-quota] cache refreshed from Google Cloud:", JSON.stringify(quotaCache.data));
  } catch (err) {
    console.error("[geo-quota] failed to refresh quota cache:", err);
  }
}

export async function getMonthlyUsage(sku?: Sku): Promise<number> {
  // Try Google Cloud cache first
  if (quotaCache.data && Date.now() - quotaCache.ts < CACHE_TTL) {
    const usage = sku
      ? (quotaCache.data[sku] ?? 0)
      : Object.values(quotaCache.data).reduce((a, b) => a + b, 0);
    return usage;
  }

  // Refresh cache if expired or missing
  if (!quotaCache.data || Date.now() - quotaCache.ts >= CACHE_TTL) {
    await refreshQuotaCache();
    if (quotaCache.data) {
      const usage = sku
        ? (quotaCache.data[sku] ?? 0)
        : Object.values(quotaCache.data).reduce((a, b) => a + b, 0);
      return usage;
    }
  }

  // Fallback to DB
  return getMonthlyUsageFromDb(sku);
}

async function getMonthlyUsageFromDb(sku?: Sku): Promise<number> {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const rows = await query(
      `SELECT COALESCE(SUM(count), 0)::int AS total
       FROM public.api_usage
       WHERE usage_date >= $1
       ${sku ? "AND sku = $2" : ""}`,
      sku ? [firstDay, sku] : [firstDay]
    );
    return rows[0]?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function canUse(sku: Sku): Promise<boolean> {
  const monthly = await getMonthlyUsage(sku);
  const limit = SKU_LIMITS[sku];
  const threshold = getThreshold(limit);
  const available = !isOverThreshold(monthly, limit);
  console.log(
    `[geo-quota] canUse ${sku} → ${available} (${monthly}/${threshold} threshold)`
  );
  return available;
}

export async function getStatus(): Promise<{
  available: boolean;
  skus: Record<Sku, { used: number; limit: number; threshold: number; available: boolean }>;
  totalUsed: number;
  totalLimit: number;
  totalThreshold: number;
}> {
  const entries = await Promise.all(
    SKUS.map(async (sku) => {
      const used = await getMonthlyUsage(sku);
      const limit = SKU_LIMITS[sku];
      const threshold = getThreshold(limit);
      return { sku, used, limit, threshold };
    })
  );

  const skus = {} as Record<
    Sku,
    { used: number; limit: number; threshold: number; available: boolean }
  >;
  let totalUsed = 0;
  let totalLimit = 0;

  for (const e of entries) {
    skus[e.sku] = {
      used: e.used,
      limit: e.limit,
      threshold: e.threshold,
      available: !isOverThreshold(e.used, e.limit),
    };
    totalUsed += e.used;
    totalLimit += e.limit;
  }

  const overallAvailable = Object.values(skus).every((s) => s.available);

  console.log(
    `[geo-quota] status → available: ${overallAvailable} | total: ${totalUsed}/${Math.floor(totalLimit * THRESHOLD_RATIO)}`
  );

  return {
    available: overallAvailable,
    skus,
    totalUsed,
    totalLimit,
    totalThreshold: Math.floor(totalLimit * THRESHOLD_RATIO),
  };
}

// Simple in-memory geocode cache
const geocodeCache = new Map<string, { lat: number; lng: number; name: string }>();
export function geocodeCacheGet(key: string) {
  return geocodeCache.get(key);
}
export function geocodeCacheSet(key: string, value: { lat: number; lng: number; name: string }) {
  geocodeCache.set(key, value);
}
export function geocodeCacheSize() {
  return geocodeCache.size;
}
