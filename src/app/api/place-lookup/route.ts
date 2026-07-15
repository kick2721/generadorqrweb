export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return Response.json({ placeId: null, error: "URL requerida" }, { status: 400 });
    }

    const isShort = /goo\.gl|maps\.app\.goo\.gl/i.test(url);
    if (!isShort) {
      return Response.json({ placeId: null }, { status: 200 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    clearTimeout(timeout);

    const finalUrl = res.url || url;
    const m = finalUrl.match(/!1s([a-zA-Z0-9:_]+)/);
    if (m) {
      return Response.json({ placeId: m[1] });
    }

    const m2 = finalUrl.match(/0x[a-fA-F0-9]+:0x[a-fA-F0-9]+/);
    if (m2) {
      return Response.json({ placeId: m2[0] });
    }

    return Response.json({ placeId: null, error: "No se encontró Place ID en el destino" });
  } catch {
    return Response.json({ placeId: null, error: "Error al resolver el link" });
  }
}
