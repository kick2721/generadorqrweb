import { NextResponse } from "next/server";
import { getStatus } from "@/lib/geo-quota";

export async function GET() {
  const status = await getStatus();
  return NextResponse.json({
    available: status.available,
    usage: {
      geocoding: { used: status.skus.geocoding.used, limit: status.skus.geocoding.limit, threshold: status.skus.geocoding.threshold },
      autocomplete: { used: status.skus.autocomplete.used, limit: status.skus.autocomplete.limit, threshold: status.skus.autocomplete.threshold },
      maps: { used: status.skus.maps.used, limit: status.skus.maps.limit, threshold: status.skus.maps.threshold },
    },
    total: { used: status.totalUsed, limit: status.totalLimit, threshold: status.totalThreshold },
  });
}
