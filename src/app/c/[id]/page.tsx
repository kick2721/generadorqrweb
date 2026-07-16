import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/themes";

interface Block {
  type: string;
  [key: string]: unknown;
}

interface CatalogData {
  blocks: Block[];
  template: string;
  fonts: string[];
}

function BlockRenderer({ block, t }: { block: Block; t: ReturnType<typeof getTheme> }) {
  const s = (k: string) => block[k] as string | undefined;
  switch (block.type) {
    case "header":
      return (
        <div className="text-center mb-8">
          <h1 style={{ color: t.text }} className="text-3xl font-bold">{s("title")}</h1>
          {s("subtitle") && <p style={{ color: t.textMuted }} className="mt-1">{s("subtitle")}</p>}
        </div>
      );
    case "section":
      return (
        <h2 style={{ color: t.text, borderColor: t.sectionBorder }} className="text-xl font-semibold mt-8 mb-4 pb-2 border-b">{s("title")}</h2>
      );
    case "item":
      return (
        <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }} className="p-4 flex gap-4 mb-3">
          {s("image") && (
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50/50" style={{ borderRadius: t.radius }}>
              <img src={s("image")} alt={s("name")} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 style={{ color: t.text }} className="font-medium">{s("name")}</h3>
              {s("price") && <span style={{ color: t.accent }} className="font-semibold whitespace-nowrap">${s("price")}</span>}
            </div>
            {s("desc") && <p style={{ color: t.textMuted }} className="text-sm mt-0.5">{s("desc")}</p>}
            {s("tag") && (
              <span style={{ background: t.tagBg, color: t.accent }} className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full">{s("tag")}</span>
            )}
          </div>
        </div>
      );
    case "text":
      return (
        <p style={{ color: t.textMuted }} className="text-sm leading-relaxed whitespace-pre-wrap my-4">{s("content")}</p>
      );
    case "image":
      return (
        <div className="my-4" style={{ borderRadius: t.radius, overflow: "hidden" }}>
          <img src={s("src")} alt={s("alt") || ""} className="w-full h-auto" />
        </div>
      );
    case "divider":
      return <hr style={{ borderColor: t.divider }} className="my-6" />;
    case "contact":
      return (
        <div style={{ background: t.cardBg, border: t.cardBorder, borderRadius: t.radius }} className="mt-8 p-4 space-y-2 text-sm" >
          {s("phone") && <p style={{ color: t.textMuted }}>📞 {s("phone")}</p>}
          {s("address") && <p style={{ color: t.textMuted }}>📍 {s("address")}</p>}
          {s("hours") && <p style={{ color: t.textMuted }}>🕐 {s("hours")}</p>}
          {s("mapsUrl") && (
            <a href={s("mapsUrl")} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="inline-block mt-2 font-medium text-xs">Abrir en Google Maps →</a>
          )}
        </div>
      );
    default:
      return null;
  }
}

export default async function CatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query(
    `SELECT ci.*, q.config FROM public.catalog_items ci JOIN public.qrcodes q ON q.id = ci.qr_id WHERE ci.qr_id = $1`,
    [id]
  );
  if (rows.length === 0) notFound();

  const item = rows[0] as unknown as CatalogData & { config: any };
  const blocks: Block[] = (item.blocks as Block[]) || [];
  const config = typeof item.config === "string" ? JSON.parse(item.config) : (item.config || {});
  const themeId = config.theme || "claro";
  const t = getTheme(themeId);
  const overrideAccent = config.accent || t.accent;
  const theme = { ...t, accent: overrideAccent };
  const fonts = item.fonts || [theme.font];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fonts.map((f: string) => f.replace(" ", "+")).join("&family=")}&display=swap`} />
      )}
      <div className="max-w-lg mx-auto px-4 py-8" style={{ fontFamily: fonts[0] || "system-ui" }}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} t={theme} />
        ))}
      </div>
    </div>
  );
}
