"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setDashboardData } from "@/lib/dashboard-cache";

export default function DashboardPrefetcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/qrcodes")
      .then(r => r.json())
      .then(data => {
        if (data?.qrcodes) {
          setDashboardData({
            qrcodes: data.qrcodes,
            plan: data.plan,
            qrCount: data.qrCount,
            qrLimit: data.qrLimit,
          });
        }
      })
      .catch(() => {});
  }, [session?.user?.id]);

  return null;
}
