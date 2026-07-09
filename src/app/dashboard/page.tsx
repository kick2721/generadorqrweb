import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { getUserPlan, getFullSubscription } from "@/lib/plan";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const [rows, { plan, qrCount, qrLimit }, subscription] = await Promise.all([
    query(
      `SELECT q.*, COALESCE(s.scan_count, 0) AS scan_count
       FROM public.qrcodes q
       LEFT JOIN (SELECT qr_id, COUNT(*) AS scan_count FROM public.scans GROUP BY qr_id) s ON s.qr_id = q.id
       WHERE q.user_id = $1
       ORDER BY q.created_at DESC`,
      [session.user.id]
    ),
    getUserPlan(),
    getFullSubscription(session.user.id),
  ]);

  const qrcodes = rows.map((r: any) => ({
    id: r.id,
    type: r.type,
    content: r.content,
    redirect_to: r.redirect_to ?? "",
    label: r.label ?? "",
    config: r.config ?? {},
    scan_count: Number(r.scan_count),
    created_at: r.created_at,
  }));

  return (
    <DashboardClient
      initialQrcodes={qrcodes}
      initialPlan={plan}
      initialQrCount={qrCount}
      initialQrLimit={qrLimit === Infinity ? 999999 : qrLimit}
      initialSubscription={subscription}
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    />
  );
}
