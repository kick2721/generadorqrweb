"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { SEEDS_BY_KIND, type CatalogTheme } from "@/lib/seed-data";
import { PRESET_THEMES } from "@/lib/catalog-theme";

interface Item {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  tag?: string;
  kcal?: string;
  time?: string;
}

interface Subcategory {
  id: string;
  name: string;
  items: Item[];
}

interface Category {
  id: string;
  name: string;
  image: string;
  desc: string;
  subcategories: Subcategory[];
}

interface Info {
  phone: string;
  address: string;
  hours: string;
  mapsUrl: string;
  name?: string;
  logo?: string;
  currency?: string;
  language?: string;
  about?: string;
}

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function newItem(overrides: Partial<Item> = {}): Item {
  return { id: genId(), name: "", desc: "", price: "", image: "", tag: "", kcal: "", time: "", ...overrides };
}

function newSubcategory(overrides: Partial<Subcategory> = {}): Subcategory {
  return { id: genId(), name: "", items: [], ...overrides };
}

function newCategory(overrides: Partial<Category> = {}): Category {
  return { id: genId(), name: "", image: "", desc: "", subcategories: [], ...overrides };
}

function reseedIds<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (key, val) => key === "id" ? genId() : val);
}

const TEMPLATES = [
  { id: "restaurant", icon: "🍽️", label: "Restaurante", desc: "Menú completo" },
  { id: "products", icon: "📦", label: "Productos", desc: "Catálogo productos" },
  { id: "services", icon: "🛠️", label: "Servicios", desc: "Lista servicios" },
  { id: "blank", icon: "📄", label: "Vacío", desc: "Empezar de cero", blank: true },
];

export default function CatalogEditPage() {
  const params = useParams();
  const router = useRouter();
  const qrId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [info, setInfo] = useState<Info | null>(null);
  const [theme, setTheme] = useState<CatalogTheme | null>(null);
  const [template, setTemplate] = useState("blank");
  const [fonts, setFonts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [previewNonce, setPreviewNonce] = useState(0);
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    if (previewOpen && savedAt > previewNonce) {
      setPreviewNonce(savedAt);
    }
  }, [previewOpen, savedAt]);

  useEffect(() => {
    fetch(`/api/catalog/${qrId}`)
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        setInfo(data.info || null);
        setTheme(data.theme || null);
        setTemplate(data.template || "blank");
        setFonts(data.fonts?.length ? data.fonts : []);
        setLoaded(true);
      })
      .catch(() => {
        setError("Failed to load catalog");
        setLoaded(true);
      });
  }, [qrId]);

  const save = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/catalog/${qrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, info, theme, template, fonts }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSavedAt(Date.now());
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [qrId, categories, info, theme, template, fonts]);

  const applyTemplate = (tid: string) => {
    setError("");
    if (tid === "blank") {
      setCategories([]);
      setInfo(null);
      setTheme(null);
      setTemplate("blank");
      setExpandedCat(null);
      setExpandedSub(null);
      return;
    }
    const seed = SEEDS_BY_KIND[tid];
    if (seed) {
      const seeded = reseedIds(seed.categories);
      setCategories(structuredClone(seeded));
      setInfo(structuredClone(seed.info));
      setTheme(seeded && structuredClone(seed.theme));
      setTemplate(tid);
      setExpandedCat(null);
      setExpandedSub(null);
      return;
    }
    setTemplate(tid);
  };

  const handleImageUpload = async (file: File, catIndex: number) => {
    setUploading(`cat-${catIndex}`);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setCategories((prev) => {
        const next = [...prev];
        next[catIndex] = { ...next[catIndex], image: url };
        return next;
      });
    } catch {
      setError("Upload failed (Pro plan required)");
    } finally {
      setUploading(null);
    }
  };

  const handleItemImageUpload = async (file: File, catIndex: number, subIndex: number, itemIndex: number) => {
    setUploading(`item-${catIndex}-${subIndex}-${itemIndex}`);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setCategories((prev) => {
        const next = structuredClone(prev) as Category[];
        next[catIndex].subcategories[subIndex].items[itemIndex].image = url;
        return next;
      });
    } catch {
      setError("Upload failed (Pro plan required)");
    } finally {
      setUploading(null);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm animate-pulse" style={{ background: "#f5f0eb", color: "#8a7a64" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "#f5f0eb" }}>
      <header className="shrink-0 px-4 py-3 flex items-center justify-between bg-white border-b" style={{ borderColor: "#e5ddd0" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-gray-500 hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="font-semibold text-sm" style={{ color: "#2d2416" }}>Edit Catalog</h1>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 text-white"
            style={{ background: "#c97b5e" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className="text-xs font-medium"
            style={{ color: "#c97b5e" }}
          >
            {previewOpen ? "Hide Preview" : "Preview →"}
          </button>
        </div>
      </header>

      <div className="shrink-0 px-4 py-2.5 flex gap-2 overflow-x-auto bg-white border-b" style={{ borderColor: "#e5ddd0" }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => applyTemplate(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-left whitespace-nowrap ${
              template === t.id && !t.blank ? "shadow-sm" : "opacity-60 hover:opacity-90"
            }`}
            style={{
              background: template === t.id && !t.blank ? "#fdf6f2" : "transparent",
              border: template === t.id && !t.blank ? "1px solid #c97b5e33" : "1px solid transparent",
            }}
          >
            <span className="text-lg">{t.icon}</span>
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: template === t.id && !t.blank ? "#c97b5e" : "#2d2416" }}
              >
                {t.label}
              </div>
              <div className="text-[10px] leading-tight" style={{ color: "#8a7a64" }}>{t.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "#2d2416" }}>
              Categories ({categories.length})
            </h2>
            <button
              onClick={() => {
                const c = newCategory();
                setCategories((prev) => [...prev, c]);
                setExpandedCat(c.id);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-white"
              style={{ background: "#c97b5e" }}
            >
              + Add Category
            </button>
          </div>

          <div className="bg-white rounded-xl border p-4 space-y-3" style={{ borderColor: "#e5ddd0" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: "#2d2416" }}>Theme</h3>
              {theme && PRESET_THEMES.some((p) => p.accent === theme.accent && p.bg === theme.bg) && (
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#8a7a64" }}>Preset</span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESET_THEMES.map((p, idx) => {
                const isActive = theme && theme.accent === p.accent && theme.bg === p.bg;
                return (
                  <button
                    key={idx}
                    type="button"
                    title={`Theme ${idx + 1}`}
                    onClick={() => setTheme({
                      bg: p.bg,
                      cardBg: p.cardBg,
                      text: p.text,
                      muted: p.muted,
                      accent: p.accent,
                      accentText: p.accentText,
                      border: p.border,
                      pillBg: p.pillBg,
                      pillText: p.pillText,
                      pillActiveBg: p.pillActiveBg,
                      pillActiveText: p.pillActiveText,
                      font: idx === 0 ? "Inter" : p.font,
                      radius: p.radius,
                      showLogo: p.showLogo,
                    })}
                    className="w-12 h-12 rounded-lg border-2 overflow-hidden flex flex-col transition-all"
                    style={{
                      borderColor: isActive ? "#2d2416" : "transparent",
                      boxShadow: isActive ? "0 0 0 2px #2d2416 inset" : undefined,
                    }}
                  >
                    <div className="flex-1" style={{ background: p.bg }} />
                    <div className="h-2" style={{ background: p.accent }} />
                  </button>
                );
              })}
            </div>
            {theme ? (
              <div className="grid grid-cols-2 gap-2 text-[10px]" style={{ color: "#8a7a64" }}>
                <label className="flex items-center gap-1">
                  Accent
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => setTheme({ ...theme, accent: e.target.value, pillActiveBg: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <span className="font-mono">{theme.accent}</span>
                </label>
                <label className="flex items-center gap-1">
                  BG
                  <input
                    type="color"
                    value={theme.bg}
                    onChange={(e) => setTheme({ ...theme, bg: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <span className="font-mono">{theme.bg}</span>
                </label>
                <label className="flex items-center gap-1">
                  Text
                  <input
                    type="color"
                    value={theme.text}
                    onChange={(e) => setTheme({ ...theme, text: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <span className="font-mono">{theme.text}</span>
                </label>
                <label className="flex items-center gap-1">
                  Card
                  <input
                    type="color"
                    value={theme.cardBg}
                    onChange={(e) => setTheme({ ...theme, cardBg: e.target.value, pillBg: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <span className="font-mono">{theme.cardBg}</span>
                </label>
                <label className="flex items-center gap-1 col-span-2">
                  Radius
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={parseInt(theme.radius)}
                    onChange={(e) => setTheme({ ...theme, radius: `${e.target.value}px` })}
                    className="flex-1"
                  />
                  <span className="font-mono w-12 text-right">{theme.radius}</span>
                </label>
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#8a7a64" }}>
                Apply a template (🍽️ Restaurante) or pick a preset above.
              </p>
            )}
          </div>

          {info && (
            <div className="bg-white rounded-xl border p-4 space-y-2 text-xs" style={{ borderColor: "#e5ddd0" }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#2d2416" }}>Business Info</h3>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Name</span>
                <input value={info.name || ""} onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} placeholder="Restaurant / Brand name" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>About</span>
                <textarea value={info.about || ""} onChange={(e) => setInfo({ ...info, about: e.target.value })}
                  rows={2}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400 resize-none"
                  style={{ color: "#2d2416" }} placeholder="Tagline / description" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Phone</span>
                <input value={info.phone || ""} onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Address</span>
                <input value={info.address || ""} onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Hours</span>
                <input value={info.hours || ""} onChange={(e) => setInfo({ ...info, hours: e.target.value })}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Maps URL</span>
                <input value={info.mapsUrl || ""} onChange={(e) => setInfo({ ...info, mapsUrl: e.target.value })}
                  className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Currency</span>
                <input value={info.currency || "$"} onChange={(e) => setInfo({ ...info, currency: e.target.value })}
                  className="w-20 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400"
                  style={{ color: "#2d2416" }} placeholder="$" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="w-20 shrink-0" style={{ color: "#8a7a64" }}>Logo</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  id="logo-upload"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setUploading("logo");
                    try {
                      const form = new FormData();
                      form.append("file", f);
                      const res = await fetch("/api/upload", { method: "POST", body: form });
                      if (!res.ok) throw new Error("Upload failed");
                      const { url } = await res.json();
                      setInfo({ ...info, logo: url });
                      setTheme(theme ? { ...theme, showLogo: true } : null);
                    } catch {
                      setError("Logo upload failed (Pro plan required)");
                    } finally {
                      setUploading(null);
                    }
                  }}
                />
                <label htmlFor="logo-upload" className="text-xs px-2.5 py-1 rounded-lg cursor-pointer" style={{ background: "#f5f0eb", color: "#8a7a64" }}>
                  {uploading === "logo" ? "..." : info.logo ? "Change logo" : "Add logo"}
                </label>
                {info.logo && (
                  <>
                    <img src={info.logo} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setInfo({ ...info, logo: "" })}
                      className="text-[10px] text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {categories.length === 0 && (
            <p className="text-sm text-center py-16" style={{ color: "#8a7a64" }}>
              No categories yet. Click a template above or add a category.
            </p>
          )}

          {categories.map((cat, catIdx) => (
            <div key={cat.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#e5ddd0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              >
                <div className="flex-1 min-w-0">
                  <input
                    value={cat.name}
                    onChange={(e) => {
                      const next = [...categories];
                      next[catIdx] = { ...next[catIdx], name: e.target.value };
                      setCategories(next);
                    }}
                    placeholder="Category name"
                    className="w-full text-sm font-semibold bg-transparent outline-none"
                    style={{ color: "#2d2416" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    value={cat.desc}
                    onChange={(e) => {
                      const next = [...categories];
                      next[catIdx] = { ...next[catIdx], desc: e.target.value };
                      setCategories(next);
                    }}
                    placeholder="Short description"
                    className="w-full text-xs mt-0.5 bg-transparent outline-none"
                    style={{ color: "#8a7a64" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <span className="text-xs" style={{ color: "#8a7a64" }}>
                  {cat.subcategories.length} sub
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirm("Delete this category and all its items?")) return;
                    setCategories((prev) => prev.filter((_, i) => i !== catIdx));
                    if (expandedCat === cat.id) setExpandedCat(null);
                  }}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <svg className={`w-4 h-4 transition-transform ${expandedCat === cat.id ? "rotate-180" : ""}`} style={{ color: "#8a7a64" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {cat.image && (
                <div className="px-4 pb-2">
                  <img src={cat.image} alt="" className="h-24 w-full object-cover rounded-lg" />
                </div>
              )}
              <div className="px-4 pb-3 flex items-center gap-2">
                <label className="text-xs px-2.5 py-1 rounded-lg cursor-pointer" style={{ background: "#f5f0eb", color: "#8a7a64" }}>
                  {uploading === `cat-${catIdx}` ? "..." : cat.image ? "Change image" : "Add image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f, catIdx);
                    }}
                  />
                </label>
                {cat.image && (
                  <button
                    onClick={() => {
                      const next = [...categories];
                      next[catIdx] = { ...next[catIdx], image: "" };
                      setCategories(next);
                    }}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              {expandedCat === cat.id && (
                <div className="border-t" style={{ borderColor: "#e5ddd0" }}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: "#2d2416" }}>Subcategories</span>
                      <button
                        onClick={() => {
                          const next = [...categories];
                          const sub = newSubcategory();
                          next[catIdx] = { ...next[catIdx], subcategories: [...next[catIdx].subcategories, sub] };
                          setCategories(next);
                          setExpandedSub(sub.id);
                        }}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg"
                        style={{ background: "#fdf6f2", color: "#c97b5e" }}
                      >
                        + Subcategory
                      </button>
                    </div>

                    {cat.subcategories.length === 0 && (
                      <p className="text-xs text-center py-6" style={{ color: "#8a7a64" }}>No subcategories yet.</p>
                    )}

                    {cat.subcategories.map((sub, subIdx) => (
                      <div key={sub.id} className="border rounded-lg" style={{ borderColor: "#e5ddd0" }}>
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer"
                          onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}
                        >
                          <input
                            value={sub.name}
                            onChange={(e) => {
                              const next = structuredClone(categories) as Category[];
                              next[catIdx].subcategories[subIdx].name = e.target.value;
                              setCategories(next);
                            }}
                            placeholder="Subcategory name"
                            className="flex-1 text-xs font-medium bg-transparent outline-none"
                            style={{ color: "#2d2416" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs" style={{ color: "#8a7a64" }}>{sub.items.length} items</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!confirm("Delete this subcategory?")) return;
                              const next = structuredClone(categories) as Category[];
                              next[catIdx].subcategories.splice(subIdx, 1);
                              setCategories(next);
                              if (expandedSub === sub.id) setExpandedSub(null);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                          <svg className={`w-3.5 h-3.5 transition-transform ${expandedSub === sub.id ? "rotate-180" : ""}`} style={{ color: "#8a7a64" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>

                        {expandedSub === sub.id && (
                          <div className="border-t p-3 space-y-3" style={{ borderColor: "#e5ddd0" }}>
                            <button
                              onClick={() => {
                                const next = structuredClone(categories) as Category[];
                                next[catIdx].subcategories[subIdx].items.push(newItem());
                                setCategories(next);
                              }}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg"
                              style={{ background: "#f5f0eb", color: "#c97b5e" }}
                            >
                              + Add Item
                            </button>

                            {sub.items.length === 0 && (
                              <p className="text-xs text-center py-4" style={{ color: "#8a7a64" }}>No items yet.</p>
                            )}

                            {sub.items.map((item, itemIdx) => (
                              <div key={item.id} className="border rounded-lg p-3 space-y-2" style={{ borderColor: "#e5ddd0" }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                      <input
                                        value={item.name}
                                        onChange={(e) => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items[itemIdx].name = e.target.value;
                                          setCategories(next);
                                        }}
                                        placeholder="Item name"
                                        className="flex-1 text-xs font-medium bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 outline-none px-0.5 py-0.5"
                                        style={{ color: "#2d2416" }}
                                      />
                                      <input
                                        value={item.price}
                                        onChange={(e) => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items[itemIdx].price = e.target.value;
                                          setCategories(next);
                                        }}
                                        placeholder="$0.00"
                                        className="w-20 text-xs font-semibold text-right bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 outline-none px-0.5 py-0.5"
                                        style={{ color: "#c97b5e" }}
                                      />
                                    </div>
                                    <textarea
                                      value={item.desc}
                                      onChange={(e) => {
                                        const next = structuredClone(categories) as Category[];
                                        next[catIdx].subcategories[subIdx].items[itemIdx].desc = e.target.value;
                                        setCategories(next);
                                      }}
                                      placeholder="Description"
                                      rows={2}
                                      className="w-full text-xs bg-transparent border border-transparent hover:border-gray-200 focus:border-gray-300 outline-none rounded px-1.5 py-1 resize-none"
                                      style={{ color: "#8a7a64" }}
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                      <input
                                        value={item.tag || ""}
                                        onChange={(e) => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items[itemIdx].tag = e.target.value;
                                          setCategories(next);
                                        }}
                                        placeholder="Tag (e.g. Popular)"
                                        className="text-[10px] bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 outline-none px-0.5 py-0.5 w-28"
                                        style={{ color: "#c97b5e" }}
                                      />
                                      <input
                                        value={item.kcal || ""}
                                        onChange={(e) => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items[itemIdx].kcal = e.target.value;
                                          setCategories(next);
                                        }}
                                        placeholder="kcal"
                                        className="text-[10px] bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 outline-none px-0.5 py-0.5 w-16"
                                        style={{ color: "#8a7a64" }}
                                      />
                                      <input
                                        value={item.time || ""}
                                        onChange={(e) => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items[itemIdx].time = e.target.value;
                                          setCategories(next);
                                        }}
                                        placeholder="min"
                                        className="text-[10px] bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 outline-none px-0.5 py-0.5 w-16"
                                        style={{ color: "#8a7a64" }}
                                      />
                                    </div>
                                    {item.image && (
                                      <img src={item.image} alt="" className="h-16 w-16 object-cover rounded-lg" />
                                    )}
                                    <div className="flex items-center gap-2">
                                      <label className="text-[10px] px-2 py-1 rounded cursor-pointer" style={{ background: "#f5f0eb", color: "#8a7a64" }}>
                                        {uploading === `item-${catIdx}-${subIdx}-${itemIdx}` ? "..." : item.image ? "Change" : "Add image"}
                                        <input
                                          type="file"
                                          accept="image/png,image/jpeg,image/gif,image/webp"
                                          className="hidden"
                                          onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleItemImageUpload(f, catIdx, subIdx, itemIdx);
                                          }}
                                        />
                                      </label>
                                      {item.image && (
                                        <button
                                          onClick={() => {
                                            const next = structuredClone(categories) as Category[];
                                            next[catIdx].subcategories[subIdx].items[itemIdx].image = "";
                                            setCategories(next);
                                          }}
                                          className="text-[10px] text-red-400 hover:text-red-600"
                                        >
                                          Remove
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          const next = structuredClone(categories) as Category[];
                                          next[catIdx].subcategories[subIdx].items.splice(itemIdx, 1);
                                          setCategories(next);
                                        }}
                                        className="text-[10px] text-red-400 hover:text-red-600 ml-auto"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {previewOpen && (
        <>
          {!savedAt && (
            <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg px-3 py-2 shadow-lg">
              Click <strong>Save</strong> to refresh the preview.
            </div>
          )}
          <div className="fixed inset-y-0 right-0 z-40 bg-black/50 flex items-stretch">
            <div
              className="relative ml-auto h-full flex flex-col"
              style={{
                width: previewDevice === "mobile" ? "380px" : "60%",
                background: "#0f0f0f",
              }}
            >
              <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: "#2a2a2a" }}>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: previewDevice === "mobile" ? "#2a2a2a" : "transparent", color: "#fff" }}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: previewDevice === "desktop" ? "#2a2a2a" : "transparent", color: "#fff" }}
                  >
                    Desktop
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewNonce(Date.now())}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: "#2a2a2a", color: "#fff" }}
                    title="Refresh"
                  >
                    ↻
                  </button>
                  <a
                    href={`/c/${qrId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: "#2a2a2a", color: "#fff" }}
                    title="Open in new tab"
                  >
                    ↗
                  </a>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: "#2a2a2a", color: "#fff" }}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-white flex items-stretch justify-center">
                <iframe
                  key={previewNonce}
                  src={`/c/${qrId}`}
                  className="w-full h-full"
                  style={{
                    maxWidth: previewDevice === "mobile" ? "380px" : "100%",
                    border: "none",
                  }}
                  title="Preview"
                />
              </div>
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute inset-0 z-30"
              style={{ background: "transparent" }}
              aria-label="Close preview backdrop"
            />
          </div>
        </>
      )}
    </div>
  );
}
