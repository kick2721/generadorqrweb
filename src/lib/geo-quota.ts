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

const THRESHOLD_RATIO = 0.8;

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

export async function getMonthlyUsage(sku?: Sku): Promise<number> {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const skuFilter = sku ?? null;
    const rows = await query(
      `SELECT COALESCE(SUM(count), 0)::int AS total
       FROM public.api_usage
       WHERE usage_date >= $1
       ${sku ? "AND sku = $2" : ""}`,
      sku ? [firstDay, skuFilter] : [firstDay]
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
