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
        <div className="text-center mb-10">
          <h1 style={{ color: t.text }} className="text-3xl sm:text-4xl font-bold tracking-tight">{s("title")}</h1>
          {s("subtitle") && <p style={{ color: t.textMuted }} className="mt-2 tracking-wide">{s("subtitle")}</p>}
          {t.headerVariant === "decorative" && <div className="w-20 h-0.5 mx-auto mt-4 rounded-full" style={{ background: t.accent }} />}
        </div>
      );
    case "section":
      return (
        <div className="flex items-center gap-2 mt-10 mb-5 pb-2"
          style={{ color: t.text, borderBottom: t.sectionVariant === "dotted" ? `2px dotted ${t.sectionBorder}` : t.sectionVariant === "bar" ? "none" : `2px solid ${t.sectionBorder}` }}>
          {t.sectionVariant === "bar" && <span className="w-1.5 h-6 rounded-sm shrink-0" style={{ background: t.accent }} />}
          <h2 className="text-xl font-semibold tracking-tight">{s("title")}</h2>
        </div>
      );
    case "item": {
      const isProducts = template === "products";
      const isServices = template === "services";
      if (isProducts) {
        return (
          <div className="group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }}>
            <div className="relative overflow-hidden">
              {s("image") ? (
                <img src={s("image")} alt={s("name")} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" style={{ borderRadius: `${t.radius} ${t.radius} 0 0` }} />
              ) : (
                <div className="w-full h-44 flex items-center justify-center" style={{ background: t.cardBg }}>
                  <svg className="w-12 h-12 opacity-20" style={{ color: t.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {s("tag") && (
                <span className="absolute top-3 right-0 text-[10px] font-bold px-3 py-1 rounded-l-full" style={{ background: t.accent, color: t.accentText }}>
                  {s("tag")}
                </span>
              )}
              {s("price") && (
                <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm" style={{ background: t.accent, color: t.accentText }}>
                  ${s("price")}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm" style={{ color: t.text }}>{s("name")}</h3>
              {s("desc") && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: t.textMuted }}>{s("desc")}</p>}
            </div>
          </div>
        );
      }
      if (isServices) {
        return (
          <div className="flex gap-4 py-4 transition-colors duration-150 hover:bg-black/[0.02] -mx-2 px-2 rounded-lg" style={{ borderBottom: `1px solid ${t.sectionBorder}` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: t.accentLight }}>
              <svg className="w-6 h-6" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm" style={{ color: t.text }}>{s("name")}</h3>
              {s("desc") && <p className="text-sm mt-0.5 leading-relaxed" style={{ color: t.textMuted }}>{s("desc")}</p>}
            </div>
          </div>
        );
      }
      return (
        <div className="group p-5 flex gap-4 mb-4 transition-all duration-200 hover:-translate-y-0.5" style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }}>
          {s("image") ? (
            <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden ring-2 ring-white/80 shadow-sm">
              <img src={s("image")} alt={s("name")} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center" style={{ background: t.accentLight }}>
              <svg className="w-8 h-8" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold" style={{ color: t.text }}>{s("name")}</h3>
              {s("price") && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm" style={{ background: t.accent, color: t.accentText }}>
                  ${s("price")}
                </span>
              )}
            </div>
            {s("desc") && <p className="text-sm mt-1 leading-relaxed" style={{ color: t.textMuted }}>{s("desc")}</p>}
            {s("tag") && (
              <span className="inline-block mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full w-fit" style={{ background: t.tagBg, color: t.accent, border: `1px solid ${t.accent}20` }}>
                {s("tag")}
              </span>
            )}
          </div>
        </div>
      );
    }
    case "text":
      return (
        <p style={{ color: t.textMuted }} className="text-sm leading-relaxed whitespace-pre-wrap my-6">{s("content")}</p>
      );
    case "image":
      return (
        <div className="my-6" style={{ borderRadius: t.radius, overflow: "hidden" }}>
          <img src={s("src")} alt={s("alt") || ""} className="w-full h-auto" />
        </div>
      );
    case "divider":
      return <hr style={{ borderColor: t.divider }} className="my-8" />;
    case "contact":
      return (
        <div style={{ background: t.cardBg, border: t.cardBorder, borderRadius: t.radius }} className="mt-10 p-5 space-y-3 text-sm" >
          {s("phone") && (
            <p style={{ color: t.textMuted }} className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {s("phone")}
            </p>
          )}
          {s("address") && (
            <p style={{ color: t.textMuted }} className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {s("address")}
            </p>
          )}
          {s("hours") && (
            <p style={{ color: t.textMuted }} className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {s("hours")}
            </p>
          )}
          {s("mapsUrl") && (
            <a href={s("mapsUrl")} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="inline-flex items-center gap-1.5 mt-3 font-medium text-xs tracking-wide uppercase">
              Abrir en Google Maps
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
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

  const maxWClass = template === "products" ? "max-w-3xl" : "max-w-lg";
  const isProducts = template === "products";

  function renderBlocks() {
    if (!isProducts) {
      return blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} t={theme} template={template} />
      ));
    }
    const elements: React.ReactNode[] = [];
    let itemBuffer: (Block & { _index: number })[] = [];
    blocks.forEach((block, i) => {
      if (block.type === "item") {
        itemBuffer.push({ ...block, _index: i });
      } else {
        if (itemBuffer.length > 0) {
          elements.push(
            <div key={`grid-${i}`} className="grid grid-cols-2 gap-4 mb-4">
              {itemBuffer.map(b => (
                <BlockRenderer key={b._index} block={b} t={theme} template={template} />
              ))}
            </div>
          );
          itemBuffer = [];
        }
        elements.push(<BlockRenderer key={i} block={block} t={theme} template={template} />);
      }
    });
    if (itemBuffer.length > 0) {
      elements.push(
        <div key="grid-end" className="grid grid-cols-2 gap-4 mb-4">
          {itemBuffer.map(b => (
            <BlockRenderer key={b._index} block={b} t={theme} template={template} />
          ))}
        </div>
      );
    }
    return elements;
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(" ", "+")}`).join("&")}&display=swap`} />
      )}
      <div className={`${maxWClass} mx-auto px-4 py-8 md:py-12`} style={{ fontFamily: fonts[0] || "system-ui" }}>
        {renderBlocks()}
      </div>
    </div>
  );
}
