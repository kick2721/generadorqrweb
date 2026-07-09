export interface DashboardCacheData {
  qrcodes: any[];
  plan: string;
  qrCount: number;
  qrLimit: number;
}

let cache: DashboardCacheData | null = null;

export function setDashboardData(data: DashboardCacheData) {
  cache = data;
}

export function getDashboardData(): DashboardCacheData | null {
  return cache;
}

export function clearDashboardData() {
  cache = null;
}
