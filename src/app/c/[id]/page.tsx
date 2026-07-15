import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface Block {
  type: string;
  [key: string]: unknown;
}

interface CatalogData {
  blocks: Block[];
  template: string;
  fonts: string[];
}

function BlockRenderer({ block }: { block: Block }) {
  const s = (k: string) => block[k] as string | undefined;
  switch (block.type) {
    case "header":
      return (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{s("title")}</h1>
          {s("subtitle") && <p className="text-gray-500 mt-1">{s("subtitle")}</p>}
        </div>
      );
    case "section":
      return (
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">{s("title")}</h2>
      );
    case "item":
      return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 mb-3">
          {s("image") && (
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
              <img src={s("image")} alt={s("name")} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-gray-900">{s("name")}</h3>
              {s("price") && <span className="text-purple-600 font-semibold whitespace-nowrap">${s("price")}</span>}
            </div>
            {s("desc") && <p className="text-sm text-gray-500 mt-0.5">{s("desc")}</p>}
            {s("tag") && (
              <span className="inline-block mt-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{s("tag")}</span>
            )}
          </div>
        </div>
      );
    case "text":
      return (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap my-4">{s("content")}</p>
      );
    case "image":
      return (
        <div className="my-4 rounded-xl overflow-hidden">
          <img src={s("src")} alt={s("alt") || ""} className="w-full h-auto" />
        </div>
      );
    case "divider":
      return <hr className="my-6 border-gray-100" />;
    case "contact":
      return (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-600">
          {s("phone") && <p>📞 {s("phone")}</p>}
          {s("address") && <p>📍 {s("address")}</p>}
          {s("hours") && <p>🕐 {s("hours")}</p>}
          {s("mapsUrl") && (
            <a href={s("mapsUrl")} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-purple-600 font-medium text-xs">Abrir en Google Maps →</a>
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
  const bgColor = config.bgColor || "#ffffff";
  const fonts = item.fonts || [];

  return (
    <div className="min-h-screen" style={{ background: bgColor }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fonts.map((f: string) => f.replace(" ", "+")).join("&family=")}&display=swap`} />
      )}
      <div className="max-w-lg mx-auto px-4 py-8" style={{ fontFamily: fonts[0] || "system-ui" }}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
