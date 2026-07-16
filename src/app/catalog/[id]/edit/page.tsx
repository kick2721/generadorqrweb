"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { themes, accentPresets, getTheme } from "@/lib/themes";

interface Block {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface CatalogData {
  blocks: Block[];
  template: string;
  fonts: string[];
  theme: string;
  accent: string;
}

const TEMPLATES = [
  { id: "blank", label: "En blanco" },
  { id: "restaurant", label: "Restaurante" },
  { id: "products", label: "Productos" },
  { id: "services", label: "Servicios" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const defaultBlocks: Record<string, Record<string, unknown>> = {
  header: { type: "header", title: "Título", subtitle: "Subtítulo" },
  section: { type: "section", title: "Sección" },
  item: { type: "item", name: "Producto", desc: "Descripción", price: "99", image: "", tag: "" },
  text: { type: "text", content: "Texto de descripción..." },
  image: { type: "image", src: "", alt: "" },
  divider: { type: "divider" },
  contact: { type: "contact", phone: "", address: "", hours: "", mapsUrl: "" },
};

function ThemeCard({ id, selected, onClick }: { id: string; selected: boolean; onClick: () => void }) {
  const t = themes[id];
  return (
    <button onClick={onClick} className={`relative w-full rounded-xl overflow-hidden transition-all duration-150 ${selected ? "ring-2 ring-purple-500 shadow-md" : "ring-1 ring-gray-200 hover:ring-gray-300"}`}>
      <div style={{ background: t.bg }} className="p-3">
        <div className="flex gap-1.5 mb-2">
          <div style={{ background: t.accent, borderRadius: t.radius }} className="w-1/3 h-1.5" />
          <div style={{ background: t.cardBg, border: t.cardBorder }} className="w-2/3 h-1.5 rounded" />
        </div>
        <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }} className="h-8 mb-1.5 flex items-center px-2 gap-1">
          <div style={{ background: t.textMuted }} className="w-1/2 h-1.5 rounded-full opacity-40" />
          <div className="w-4 h-2 rounded-sm ml-auto" style={{ background: t.accent, borderRadius: "2px" }} />
        </div>
        <div style={{ background: t.cardBg, border: t.cardBorder, boxShadow: t.cardShadow, borderRadius: t.radius }} className="h-6 flex items-center px-2 gap-1">
          <div style={{ background: t.textMuted }} className="w-1/3 h-1 rounded-full opacity-30" />
        </div>
      </div>
      <div className="bg-white px-3 py-1.5 text-left">
        <span style={{ color: t.text }} className="text-xs font-medium">{t.label}</span>
      </div>
    </button>
  );
}

function AccentPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {accentPresets.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className={`w-6 h-6 rounded-full transition-all duration-100 ${value === c ? "ring-2 ring-offset-2 ring-purple-500 scale-110" : "ring-1 ring-gray-200 hover:scale-105"}`}
          style={{ background: c }} />
      ))}
    </div>
  );
}

function BlockPreview({ block, onSelect, theme }: { block: Block; onSelect: () => void; theme: ReturnType<typeof getTheme> }) {
  const s = (k: string) => block[k] as string | undefined;
  switch (block.type) {
    case "header":
      return (
        <div className="text-center mb-6 cursor-pointer hover:ring-2 hover:ring-purple-400 rounded-lg p-2 transition" onClick={onSelect}>
          <div className="text-xl font-bold" style={{ color: theme.text }}>{s("title") || "Título"}</div>
          {s("subtitle") && <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{s("subtitle")}</div>}
        </div>
      );
    case "section":
      return (
        <div className="font-semibold text-sm mt-6 mb-3 pb-1.5 border-b cursor-pointer hover:ring-2 hover:ring-purple-400 rounded transition px-2" onClick={onSelect} style={{ color: theme.text, borderColor: theme.sectionBorder }}>
          {s("title") || "Sección"}
        </div>
      );
    case "item":
      return (
        <div className="flex gap-3 mb-2.5 p-3 cursor-pointer hover:ring-2 hover:ring-purple-400 transition" onClick={onSelect}
          style={{ background: theme.cardBg, border: theme.cardBorder, boxShadow: theme.cardShadow, borderRadius: theme.radius }}>
          {s("image") ? (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-50/50" style={{ borderRadius: theme.radius }}>
              <img src={s("image")} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-1">
              <span className="font-medium text-sm" style={{ color: theme.text }}>{s("name")}</span>
              {s("price") && <span className="font-semibold text-xs whitespace-nowrap" style={{ color: theme.accent }}>${s("price")}</span>}
            </div>
            {s("desc") && <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: theme.textMuted }}>{s("desc")}</p>}
            {s("tag") && <span className="inline-block mt-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: theme.tagBg, color: theme.accent }}>{s("tag")}</span>}
          </div>
        </div>
      );
    case "text":
      return (
        <p className="text-xs my-3 cursor-pointer hover:ring-2 hover:ring-purple-400 rounded p-2 transition" style={{ color: theme.textMuted }} onClick={onSelect}>
          {s("content") || "Texto"}
        </p>
      );
    case "image":
      return (
        <div className="my-3 cursor-pointer hover:ring-2 hover:ring-purple-400 overflow-hidden transition" style={{ borderRadius: theme.radius }} onClick={onSelect}>
          {s("src") ? <img src={s("src")} alt="" className="w-full h-auto" /> : <div className="w-full h-24 flex items-center justify-center text-xs" style={{ background: theme.cardBg, color: theme.textMuted }}>Sin imagen</div>}
        </div>
      );
    case "divider":
      return <hr className="my-4 cursor-pointer hover:border-purple-300 transition" style={{ borderColor: theme.divider }} onClick={onSelect} />;
    case "contact":
      return (
        <div className="mt-6 p-3 rounded-lg text-xs space-y-1.5 cursor-pointer hover:ring-2 hover:ring-purple-400 transition" onClick={onSelect} style={{ background: theme.cardBg, border: theme.cardBorder, borderRadius: theme.radius, color: theme.textMuted }}>
          {s("phone") && <p>📞 {s("phone")}</p>}
          {s("address") && <p>📍 {s("address")}</p>}
          {s("hours") && <p>🕐 {s("hours")}</p>}
        </div>
      );
    default:
      return null;
  }
}

function BlockEditor({ block, onChange, onDelete, onClose }: {
  block: Block; onChange: (updated: Block) => void; onDelete: () => void; onClose: () => void;
}) {
  const update = (key: string, value: unknown) => onChange({ ...block, [key]: value });

  const fields: { key: string; label: string; type: string; placeholder?: string }[] = (() => {
    switch (block.type) {
      case "header": return [
        { key: "title", label: "Título", type: "text", placeholder: "Título principal" },
        { key: "subtitle", label: "Subtítulo", type: "text", placeholder: "Subtítulo opcional" },
      ];
      case "section": return [
        { key: "title", label: "Título de sección", type: "text", placeholder: "Ej: Bebidas" },
      ];
      case "item": return [
        { key: "name", label: "Nombre", type: "text", placeholder: "Nombre del producto" },
        { key: "desc", label: "Descripción", type: "textarea", placeholder: "Descripción breve" },
        { key: "price", label: "Precio", type: "text", placeholder: "99" },
        { key: "tag", label: "Etiqueta", type: "text", placeholder: "Ej: Nuevo, Popular" },
        { key: "image", label: "URL de imagen", type: "text", placeholder: "https://..." },
      ];
      case "text": return [
        { key: "content", label: "Texto", type: "textarea", placeholder: "Contenido" },
      ];
      case "image": return [
        { key: "src", label: "URL de imagen", type: "text", placeholder: "https://..." },
        { key: "alt", label: "Texto alternativo", type: "text", placeholder: "Descripción" },
      ];
      case "divider": return [];
      case "contact": return [
        { key: "phone", label: "Teléfono", type: "text", placeholder: "+54 11 1234-5678" },
        { key: "address", label: "Dirección", type: "text", placeholder: "Av. Ejemplo 123" },
        { key: "hours", label: "Horarios", type: "text", placeholder: "Lun-Vie 9-18hs" },
        { key: "mapsUrl", label: "URL de Google Maps", type: "text", placeholder: "https://maps.google.com/..." },
      ];
      default: return [];
    }
  })();

  return (
    <div className="bg-white border-l border-gray-200 w-full max-w-sm p-5 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-sm text-gray-800 capitalize">Editar {block.type}</h3>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex-1 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea value={(block[f.key] as string) || ""} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-400 resize-none" />
            ) : (
              <input type={f.type} value={(block[f.key] as string) || ""} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-400" />
            )}
          </div>
        ))}
      </div>
      <button onClick={onDelete} className="mt-6 text-xs text-red-400 hover:text-red-600 transition-colors text-center">Eliminar bloque</button>
    </div>
  );
}

const TEMPLATE_BLOCKS: Record<string, Block[]> = {
  blank: [],
  restaurant: [
    { id: generateId(), type: "header", title: "Nuestro Menú", subtitle: "Sabores que enamoran" },
    { id: generateId(), type: "section", title: "Entradas" },
    { id: generateId(), type: "item", name: "Bruschetta", desc: "Pan tostado con tomate, albahaca y mozzarella", price: "12", image: "", tag: "Popular" },
    { id: generateId(), type: "item", name: "Carpaccio", desc: "Res fina con rúcula y parmesano", price: "15", image: "", tag: "" },
    { id: generateId(), type: "section", title: "Principales" },
    { id: generateId(), type: "item", name: "Pasta Alfredo", desc: "Fettuccine en salsa cremosa con pollo", price: "22", image: "", tag: "" },
    { id: generateId(), type: "item", name: "Salmón Grill", desc: "Salmón con verduras salteadas", price: "28", image: "", tag: "Chef" },
    { id: generateId(), type: "divider" },
    { id: generateId(), type: "contact", phone: "+54 11 1234-5678", address: "Av. Principal 456", hours: "Mar-Dom 12-23hs", mapsUrl: "" },
  ],
  products: [
    { id: generateId(), type: "header", title: "Nuestros Productos", subtitle: "Calidad y confianza" },
    { id: generateId(), type: "item", name: "Producto 1", desc: "Descripción del producto", price: "49.99", image: "", tag: "Más vendido" },
    { id: generateId(), type: "item", name: "Producto 2", desc: "Descripción del producto", price: "79.99", image: "", tag: "" },
    { id: generateId(), type: "item", name: "Producto 3", desc: "Descripción del producto", price: "99.99", image: "", tag: "Nuevo" },
    { id: generateId(), type: "contact", phone: "+54 11 1234-5678", address: "", hours: "Lun-Vie 9-18hs", mapsUrl: "" },
  ],
  services: [
    { id: generateId(), type: "header", title: "Nuestros Servicios", subtitle: "Tu mejor opción" },
    { id: generateId(), type: "text", content: "Ofrecemos soluciones profesionales con años de experiencia en el rubro." },
    { id: generateId(), type: "section", title: "Servicios" },
    { id: generateId(), type: "item", name: "Servicio 1", desc: "Descripción detallada del servicio", price: "", image: "", tag: "" },
    { id: generateId(), type: "item", name: "Servicio 2", desc: "Descripción detallada del servicio", price: "", image: "", tag: "" },
    { id: generateId(), type: "contact", phone: "+54 11 1234-5678", address: "Av. Ejemplo 789", hours: "Lun-Vie 9-18hs", mapsUrl: "" },
  ],
};

export default function CatalogEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [template, setTemplate] = useState("blank");
  const [fonts, setFonts] = useState<string[]>([]);
  const [themeId, setThemeId] = useState("claro");
  const [accentColor, setAccentColor] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/catalog/${id}`)
      .then(res => res.json())
      .then((data: CatalogData) => {
        setBlocks(data.blocks || []);
        setTemplate(data.template || "blank");
        setFonts(data.fonts?.length ? data.fonts : []);
        setThemeId(data.theme || "claro");
        setAccentColor(data.accent || "");
        setLoaded(true);
      })
      .catch(() => { setError("No se pudo cargar el catálogo"); setLoaded(true); });
  }, [id]);

  const theme = useMemo(() => {
    const t = getTheme(themeId);
    return accentColor ? { ...t, accent: accentColor } : t;
  }, [themeId, accentColor]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/catalog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks,
          template,
          fonts: [theme.font, ...fonts.filter(f => f !== theme.font)],
          theme: themeId,
          accent: accentColor,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  }, [id, blocks, template, themeId, accentColor, fonts, theme.font]);

  const addBlock = (type: string) => {
    const def = defaultBlocks[type];
    if (!def) return;
    const block = { id: generateId(), ...def } as Block;
    setBlocks(prev => [...prev, block]);
    setSelectedId(block.id);
  };

  const updateBlock = (updated: Block) => {
    setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const deleteBlock = () => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === selectedId);
      const next = prev.filter(b => b.id !== selectedId);
      setSelectedId(next[Math.min(idx, next.length - 1)]?.id || null);
      return next;
    });
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    setBlocks(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const applyTemplate = (tid: string) => {
    const newBlocks = TEMPLATE_BLOCKS[tid] || [];
    setBlocks(newBlocks.map(b => ({ ...b, id: generateId() })));
    setTemplate(tid);
    setSelectedId(null);
  };

  const selectedBlock = blocks.find(b => b.id === selectedId) || null;

  if (error && !loaded) return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{error}</div>;
  if (!loaded) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm animate-pulse">Cargando...</div>;

  return (
    <div className="h-screen flex flex-col" style={{ background: theme.bg }}>
      <header className="px-4 py-3 flex items-center justify-between shrink-0" style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.sectionBorder}` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} style={{ color: theme.textMuted }} className="hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="font-semibold text-sm" style={{ color: theme.text }}>Editor de Catálogo</h1>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button onClick={save} disabled={saving}
            className="px-5 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{ background: theme.accent, color: accentColor ? "#ffffff" : "#ffffff" }}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <a href={`/c/${id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: theme.accent }}>Ver →</a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 overflow-y-auto shrink-0 p-4 space-y-5 hidden md:block" style={{ background: theme.cardBg, borderRight: `1px solid ${theme.sectionBorder}` }}>
          {/* Theme selector */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textMuted }}>Tema visual</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(themes).map(tid => (
                <ThemeCard key={tid} id={tid} selected={themeId === tid} onClick={() => setThemeId(tid)} />
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textMuted }}>Color de acento</h3>
            <AccentPicker value={accentColor || theme.accent} onChange={setAccentColor} />
            {accentColor && (
              <button onClick={() => setAccentColor("")} className="text-[10px] mt-1.5 opacity-60 hover:opacity-100" style={{ color: theme.textMuted }}>Usar color del tema</button>
            )}
          </div>

          {/* Template */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textMuted }}>Contenido</h3>
            <div className="space-y-1">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => applyTemplate(t.id)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors"
                  style={{ background: template === t.id ? theme.accentLight : "transparent", color: template === t.id ? theme.accent : theme.textMuted }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add blocks */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textMuted }}>Agregar bloque</h3>
            <div className="grid grid-cols-1 gap-1">
              {[
                { type: "header", label: "Encabezado" },
                { type: "section", label: "Sección" },
                { type: "item", label: "Producto/Servicio" },
                { type: "text", label: "Texto" },
                { type: "image", label: "Imagen" },
                { type: "divider", label: "Divisor" },
                { type: "contact", label: "Contacto" },
              ].map(btn => (
                <button key={btn.type} onClick={() => addBlock(btn.type)}
                  className="text-left text-sm px-3 py-2 rounded-lg transition-colors hover:opacity-70"
                  style={{ color: theme.textMuted }}>
                  + {btn.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 flex gap-1 overflow-x-auto p-2" style={{ background: theme.cardBg, borderTop: `1px solid ${theme.sectionBorder}` }}>
          {["header","section","item","text","image","divider","contact"].map(t => (
            <button key={t} onClick={() => addBlock(t)} className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full shrink-0" style={{ background: theme.accentLight, color: theme.accent }}>
              + {t}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto flex justify-center py-6 px-4 pb-20 md:pb-6">
          <div className="w-full max-w-sm">
            {blocks.length === 0 ? (
              <div className="text-center py-20" style={{ color: theme.textMuted }}>
                <p className="text-sm">Agregá bloques desde la barra lateral</p>
                <p className="text-xs mt-1 opacity-60">Usá una plantilla para empezar rápido</p>
              </div>
            ) : (
              <div style={{ fontFamily: theme.font === "Inter" ? "system-ui" : theme.font }}>
                {blocks.map((block, i) => (
                  <div key={block.id} className="relative group">
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex-col opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                      <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="p-0.5 disabled:opacity-20 hover:opacity-70" style={{ color: theme.textMuted }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="p-0.5 disabled:opacity-20 hover:opacity-70" style={{ color: theme.textMuted }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                    <BlockPreview block={block} onSelect={() => setSelectedId(block.id)} theme={theme} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {selectedBlock && (
          <BlockEditor key={selectedBlock.id} block={selectedBlock} onChange={updateBlock} onDelete={deleteBlock} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </div>
  );
}
