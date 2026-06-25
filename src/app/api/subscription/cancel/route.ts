import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFullSubscription } from "@/lib/plan";
import { cancelSubscription } from "@/lib/lemon-squeezy";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await getFullSubscription(session.user.id);
  if (!sub?.lemon_squeezy_subscription_id) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
  }

  const result = await cancelSubscription(sub.lemon_squeezy_subscription_id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Failed to cancel subscription" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
