import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();
    if (!url || !question) {
      return NextResponse.json({ answer: "Faltan datos." }, { status: 400 });
    }

    let context = "";
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const html = await res.text();
        const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
        const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1]
          || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)?.[1] || "";
        context = `Título: ${title}\nDescripción: ${desc}`;
      }
    } catch {}

    const q = question.toLowerCase();

    if (q.includes("qué es") || q.includes("qué contiene") || q.includes("de qué trata")) {
      if (context) {
        return NextResponse.json({ answer: `Este enlace lleva a: **${context.split("\n")[0]?.replace("Título: ", "")}**. ${context.split("\n")[1]?.replace("Descripción: ", "") || "No hay más información disponible."}` });
      }
      return NextResponse.json({ answer: `Este enlace redirige a **${url}**. No pude obtener más detalles de la página.` });
    }

    if (q.includes("quién creó") || q.includes("quién hizo") || q.includes("quién está detrás")) {
      return NextResponse.json({ answer: "Este código QR fue creado con **QRWing**. El propietario del QR configuró el destino del enlace." });
    }

    if (q.includes("seguro") || q.includes("confiable") || q.includes("phishing") || q.includes("virus")) {
      return NextResponse.json({ answer: `Este enlace dirige a: **${url}**. Siempre verifica que la URL sea la esperada. Si tienes dudas, no introduzcas datos personales.` });
    }

    if (q.includes("qr") || q.includes("código")) {
      return NextResponse.json({ answer: "Este es un **código QR dinámico** creado con **QRWing**. El propietario puede actualizar el destino en cualquier momento. Los QR estáticos tienen la información grabada permanentemente." });
    }

    return NextResponse.json({
      answer: `Sobre **${url}**: ${context ? `La página tiene este título: ${context.split("\n")[0]?.replace("Título: ", "")}.` : ""} ¿Hay algo más que quieras saber? Puedes preguntarme sobre qué contiene, si es seguro, o cómo funciona.`
    });
  } catch {
    return NextResponse.json({ answer: "Lo siento, ocurrió un error al procesar tu pregunta." }, { status: 500 });
  }
}
