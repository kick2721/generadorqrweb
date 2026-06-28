import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, format = "png", size = 256, color = "#000000", bg = "#ffffff" } = body;

    if (!data || typeof data !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'data' field" }, { status: 400 });
    }

    const fg = hexRgb(color);
    const background = hexRgb(bg);

    if (format === "svg") {
      const svg = await QRCode.toString(data, {
        type: "svg",
        color: { dark: fg, light: background },
        width: Math.min(size, 1024),
        margin: 2,
        errorCorrectionLevel: "M",
      });
      return new NextResponse(svg, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
      });
    }

    const png = await QRCode.toBuffer(data, {
      type: "png",
      color: { dark: fg, light: background },
      width: Math.min(size, 1024),
      margin: 2,
      errorCorrectionLevel: "M",
    });
    return new NextResponse(new Uint8Array(png), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 });
  }
}

function hexRgb(hex: string): string {
  return hex.replace(/^#/, "");
}
