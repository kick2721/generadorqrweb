import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("d");
  if (!d) {
    return NextResponse.json({ error: "missing d param" }, { status: 400 });
  }

  let decoded: string;
  try {
    decoded = atob(d.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return NextResponse.json({ error: "invalid base64" }, { status: 400 });
  }

  return new NextResponse(decoded, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "inline",
    },
  });
}
