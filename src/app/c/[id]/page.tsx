import { query } from "@/lib/db";
import { notFound } from "next/navigation";

interface Block {
  id?: string;
  type: string;
  [key: string]: unknown;
}

interface CatalogData {
  blocks: Block[];
  template: string;
  fonts: string[];
}

const C = {
  bg: "#f5f0eb",
  cardBg: "#ffffff",
  cardBorder: "1px solid #e5ddd0",
  cardShadow: "0 2px 12px rgba(0,0,0,0.05)",
  text: "#2d2416",
  textMuted: "#8a7a64",
  accent: "#c97b5e",
  accentLight: "#fdf6f2",
  accentText: "#ffffff",
  radius: "12px",
  tagBg: "#f5f0eb",
  sectionBorder: "#e5ddd0",
  divider: "#eee7dd",
};

function s(block: Block, k: string) {
  return block[k] as string | undefined;
}

function ItemCard({ block, index }: { block: Block; index: number }) {
  const price = s(block, "price");
  const tag = s(block, "tag");
  const kcal = s(block, "kcal");
  const time = s(block, "time");
  const hasImage = !!s(block, "image");

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border" style={{ borderColor: C.sectionBorder, boxShadow: C.cardShadow }}>
      {s(block, "image") ? (
        <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden">
          <img src={s(block, "image")} alt={s(block, "name") || ""} className="w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-[15px]" style={{ color: C.text }}>{s(block, "name")}</h3>
          {price ? (
            <span className="font-semibold text-sm whitespace-nowrap" style={{ color: C.accent }}>${price}</span>
          ) : null}
        </div>
        {s(block, "desc") ? (
          <p className="text-sm mt-0.5 leading-relaxed" style={{ color: C.textMuted }}>{s(block, "desc")}</p>
        ) : null}
        <div className="flex items-center gap-2 mt-2">
          {kcal ? (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: C.tagBg, color: C.textMuted }}>{kcal} kcal</span>
          ) : null}
          {time ? (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: C.tagBg, color: C.textMuted }}>{time} min</span>
          ) : null}
          {tag ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.accentLight, color: C.accent }}>{tag}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ block, index }: { block: Block; index: number }) {
  return (
    <div className="group flex flex-col overflow-hidden bg-white rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={{ borderColor: C.sectionBorder, boxShadow: C.cardShadow }}>
      <div className="relative overflow-hidden">
        {s(block, "image") ? (
          <img src={s(block, "image")} alt={s(block, "name") || ""} className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-40 flex items-center justify-center" style={{ background: C.accentLight }}>
            <svg className="w-10 h-10 opacity-30" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {s(block, "tag") ? (
          <span className="absolute top-3 right-0 text-[10px] font-bold px-3 py-1 rounded-l-full" style={{ background: C.accent, color: C.accentText }}>{s(block, "tag")}</span>
        ) : null}
        {s(block, "price") ? (
          <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm" style={{ background: C.accent, color: C.accentText }}>${s(block, "price")}</span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm" style={{ color: C.text }}>{s(block, "name")}</h3>
        {s(block, "desc") ? (
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: C.textMuted }}>{s(block, "desc")}</p>
        ) : null}
      </div>
    </div>
  );
}

function ServiceCard({ block, index }: { block: Block; index: number }) {
  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0" style={{ borderColor: C.sectionBorder }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: C.accentLight }}>
        <svg className="w-6 h-6" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm" style={{ color: C.text }}>{s(block, "name")}</h3>
        {s(block, "desc") ? (
          <p className="text-sm mt-0.5 leading-relaxed" style={{ color: C.textMuted }}>{s(block, "desc")}</p>
        ) : null}
        {s(block, "cta") ? (
          <button className="mt-2 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors" style={{ background: C.accent, color: C.accentText }}>
            {s(block, "cta")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BlockRenderer({ block, template }: { block: Block; template: string }) {
  switch (block.type) {
    case "header":
      return (
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: C.text }}>{s(block, "title")}</h1>
          {s(block, "subtitle") ? <p className="mt-2 tracking-wide" style={{ color: C.textMuted }}>{s(block, "subtitle")}</p> : null}
          <div className="w-20 h-0.5 mx-auto mt-4 rounded-full" style={{ background: C.accent }} />
        </div>
      );
    case "section":
      return (
        <div className="flex items-center gap-2 mt-10 mb-5 pb-2 border-b" style={{ color: C.text, borderColor: C.sectionBorder }}>
          <span className="w-1.5 h-6 rounded-sm shrink-0" style={{ background: C.accent }} />
          <h2 className="text-xl font-semibold tracking-tight">{s(block, "title")}</h2>
        </div>
      );
    case "item": {
      if (template === "products") return <ProductCard block={block} index={0} />;
      if (template === "services") return <ServiceCard block={block} index={0} />;
      return <ItemCard block={block} index={0} />;
    }
    case "text":
      return <p className="text-sm leading-relaxed whitespace-pre-wrap my-6" style={{ color: C.textMuted }}>{s(block, "content")}</p>;
    case "image":
      return (
        <div className="my-6 overflow-hidden" style={{ borderRadius: C.radius }}>
          <img src={s(block, "src")} alt={s(block, "alt") || ""} className="w-full h-auto" />
        </div>
      );
    case "divider":
      return <hr className="my-8" style={{ borderColor: C.divider }} />;
    case "contact":
      return (
        <div className="mt-10 p-5 bg-white rounded-xl border space-y-3 text-sm" style={{ borderColor: C.sectionBorder, boxShadow: C.cardShadow }}>
          {s(block, "phone") ? (
            <p className="flex items-center gap-2.5" style={{ color: C.textMuted }}>
              <svg className="w-4 h-4 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {s(block, "phone")}
            </p>
          ) : null}
          {s(block, "address") ? (
            <p className="flex items-center gap-2.5" style={{ color: C.textMuted }}>
              <svg className="w-4 h-4 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {s(block, "address")}
            </p>
          ) : null}
          {s(block, "hours") ? (
            <p className="flex items-center gap-2.5" style={{ color: C.textMuted }}>
              <svg className="w-4 h-4 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {s(block, "hours")}
            </p>
          ) : null}
          {s(block, "mapsUrl") ? (
            <a href={s(block, "mapsUrl")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 font-medium text-xs tracking-wide uppercase" style={{ color: C.accent }}>
              Abrir en Google Maps
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          ) : null}
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
  const fonts = item.fonts || [];
  const template = item.template || "";

  const isRestaurant = template !== "products" && template !== "services";
  const isProducts = template === "products";

  function renderBlocks() {
    if (!isProducts) {
      return blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} template={template} />
      ));
    }
    const elements: React.ReactNode[] = [];
    let buffer: Block[] = [];
    blocks.forEach((block, i) => {
      if (block.type === "item") {
        buffer.push(block);
      } else {
        if (buffer.length) {
          elements.push(
            <div key={`grid-${i}`} className="grid grid-cols-2 gap-4 mb-4">
              {buffer.map((b, j) => <BlockRenderer key={`${i}-${j}`} block={b} template={template} />)}
            </div>
          );
          buffer = [];
        }
        elements.push(<BlockRenderer key={i} block={block} template={template} />);
      }
    });
    if (buffer.length) {
      elements.push(
        <div key="grid-end" className="grid grid-cols-2 gap-4 mb-4">
          {buffer.map((b, j) => <BlockRenderer key={`end-${j}`} block={b} template={template} />)}
        </div>
      );
    }
    return elements;
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(" ", "+")}`).join("&")}&display=swap`} />
      )}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12" style={{ fontFamily: fonts[0] || "system-ui" }}>
        {renderBlocks()}
      </div>
    </div>
  );
}
