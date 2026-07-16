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

function BlockRenderer({ block, t, template }: { block: Block; t: ReturnType<typeof getTheme>; template: string }) {
  const s = (k: string) => block[k] as string | undefined;
  switch (block.type) {
    case "header":
      return (
        <div className="text-center mb-8">
          <h1 style={{ color: t.text }} className="text-3xl font-bold">{s("title")}</h1>
          {s("subtitle") && <p style={{ color: t.textMuted }} className="mt-1">{s("subtitle")}</p>}
          {t.headerVariant === "decorative" && <div className="w-16 h-0.5 mx-auto mt-3 rounded-full" style={{ background: t.accent }} />}
        </div>
      );
    case "section":
      return (
        <div className="flex items-center gap-2 mt-8 mb-4 pb-2"
          style={{ color: t.text, borderBottom: t.sectionVariant === "dotted" ? `2px dotted ${t.sectionBorder}` : t.sectionVariant === "bar" ? "none" : `2px solid ${t.sectionBorder}` }}>
          {t.sectionVariant === "bar" && <span className="w-1 h-5 rounded-sm shrink-0" style={{ background: t.accent }} />}
          <h2 className="text-xl font-semibold">{s("title")}</h2>
        </div>
      );
    case "item": {
      const isProducts = template === "products";
      const isServices = template === "services";
      if (isProducts) {
        return (
          <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }} className="flex flex-col overflow-hidden mb-4">
            <div className="relative">
              {s("image") ? (
                <img src={s("image")} alt={s("name")} className="w-full h-36 object-cover" style={{ borderRadius: `${t.radius} ${t.radius} 0 0` }} />
              ) : (
                <div className="w-full h-32 flex items-center justify-center" style={{ background: t.cardBg }}>
                  <svg className="w-10 h-10 opacity-20" style={{ color: t.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {s("tag") && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-sm" style={{ background: t.accent, color: t.accentText }}>
                  {s("tag")}
                </span>
              )}
              {s("price") && (
                <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-1 rounded" style={{ background: t.accent, color: t.accentText }}>
                  ${s("price")}
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium" style={{ color: t.text }}>{s("name")}</h3>
              {s("desc") && <p className="text-sm mt-1" style={{ color: t.textMuted }}>{s("desc")}</p>}
            </div>
          </div>
        );
      }
      if (isServices) {
        return (
          <div className="flex gap-3 py-3" style={{ borderBottom: `1px solid ${t.sectionBorder}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: t.accentLight }}>
              <svg className="w-5 h-5" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium" style={{ color: t.text }}>{s("name")}</h3>
              {s("desc") && <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{s("desc")}</p>}
            </div>
          </div>
        );
      }
      return (
        <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }} className="p-4 flex gap-4 mb-3">
          {s("image") ? (
            <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden bg-gray-50/50">
              <img src={s("image")} alt={s("name")} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center" style={{ background: t.accentLight }}>
              <span className="text-xl" style={{ color: t.accent }}>🍽</span>
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
    }
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
  const template = item.template || "";

  const maxWClass = template === "products" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(" ", "+")}`).join("&")}&display=swap`} />
      )}
      <div className={`${maxWClass} mx-auto px-4 py-8`} style={{ fontFamily: fonts[0] || "system-ui" }}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} t={theme} template={template} />
        ))}
      </div>
    </div>
  );
}
