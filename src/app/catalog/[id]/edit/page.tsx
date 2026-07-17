"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { SEEDS_BY_KIND, type CatalogTheme } from "@/lib/seed-data";
import { PRESET_THEMES } from "@/lib/catalog-theme";
import { getT } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

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

const ONBOARDING_OPTIONS = [
  { id: "restaurant", icon: "🍽️", key: "catalogOnboardingRestaurant", descKey: "catalogOnboardingRestaurantDesc", count: "86 items" },
  { id: "products", icon: "📦", key: "catalogOnboardingProducts", descKey: "catalogOnboardingProductsDesc", count: "14 items" },
  { id: "services", icon: "🛠️", key: "catalogOnboardingServices", descKey: "catalogOnboardingServicesDesc", count: "12 items" },
  { id: "blank", icon: "📄", key: "catalogOnboardingBlank", descKey: "catalogOnboardingBlankDesc" },
];

const TEMPLATE_CHIPS = [
  { id: "restaurant", icon: "🍽️", key: "catalogOnboardingRestaurant" },
  { id: "products", icon: "📦", key: "catalogOnboardingProducts" },
  { id: "services", icon: "🛠️", key: "catalogOnboardingServices" },
  { id: "blank", icon: "📄", key: "catalogOnboardingBlank" },
];

export default function CatalogEditPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const t = getT(lang);
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
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showTheme, setShowTheme] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const showOnboarding = template === "blank" && categories.length === 0;

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
        if (data.theme) setShowTheme(true);
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
      setShowTheme(false);
      setShowBusiness(false);
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
      setShowTheme(true);
      return;
    }
    setTemplate(tid);
  };

  useEffect(() => {
    if (!previewRef.current) return;
    const timer = setTimeout(() => {
      previewRef.current?.contentWindow?.postMessage(
        { type: "catalog-preview-update", categories, info, theme },
        window.location.origin
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [categories, info, theme]);

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
      <div className="min-h-screen flex items-center justify-center text-sm animate-pulse bg-neutral-50 text-neutral-400">
        Loading...
      </div>
    );
  }

  const colorDot = (color: string, label: string, onChange: (v: string) => void) => (
    <label className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
      <span className="w-7 shrink-0">{label}</span>
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
      <span className="font-mono text-[9px] text-neutral-400">{color}</span>
    </label>
  );

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* HEADER */}
      <header className="shrink-0 h-12 flex items-center justify-between px-4 bg-white border-b border-neutral-200 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-neutral-400 hover:text-neutral-600 transition" title="Back">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="font-semibold text-sm text-neutral-800 truncate max-w-[200px]">{info?.name || "Catalog"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
          <button onClick={save} disabled={saving} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition disabled:opacity-50">
            {saving ? "..." : "Save"}
          </button>
        </div>
      </header>

      {/* 3-COLUMN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1 — SETUP */}
        <aside className="w-[260px] shrink-0 overflow-y-auto bg-white border-r border-neutral-200 flex flex-col">
          {showOnboarding ? (
            /* ONBOARDING */
            <div className="p-4 space-y-4">
              <div className="text-center">
                <h2 className="text-sm font-bold text-neutral-800">{t.catalogOnboardingTitle}</h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">{t.catalogOnboardingSubtitle}</p>
              </div>
              <div className="space-y-2.5">
                {ONBOARDING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => applyTemplate(opt.id)}
                    className="w-full text-left p-3 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all active:scale-[0.98] group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-neutral-800">{(t as any)[opt.key]}</p>
                          {opt.count && <span className="text-[9px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">{opt.count}</span>}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">{(t as any)[opt.descKey]}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 mt-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* SETUP NORMAL */
            <div className="flex-1 flex flex-col">
              {/* Template chips */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-medium text-neutral-400 mb-2 uppercase tracking-wider">Template</p>
                <div className="flex gap-1.5">
                  {TEMPLATE_CHIPS.map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => applyTemplate(chip.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        template === chip.id && chip.id !== "blank"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                      title={(t as any)[chip.key]}
                    >
                      <span>{chip.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme section */}
              <div className="px-4">
                <button
                  onClick={() => setShowTheme(!showTheme)}
                  className="flex items-center justify-between w-full py-2 text-left"
                >
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{t.catalogSetupTheme}</span>
                  <svg className={`w-3 h-3 text-neutral-400 transition-transform ${showTheme ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTheme && (
                  <div className="space-y-3 pb-3">
                    {/* Preset chips */}
                    <div className="flex gap-1.5 flex-wrap">
                      {PRESET_THEMES.map((p, idx) => {
                        const isActive = theme && theme.accent === p.accent && theme.bg === p.bg;
                        return (
                          <button
                            key={idx}
                            onClick={() => setTheme({ ...p, showLogo: p.showLogo })}
                            className={`w-8 h-8 rounded-md border-2 flex flex-col overflow-hidden ${isActive ? "border-neutral-800 shadow-sm" : "border-transparent hover:border-neutral-300"}`}
                          >
                            <div className="flex-1" style={{ background: p.bg }} />
                            <div className="h-1.5" style={{ background: p.accent }} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Color pickers */}
                    {theme && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {colorDot(theme.accent, "Accent", (v) => setTheme({ ...theme, accent: v, pillActiveBg: v }))}
                        {colorDot(theme.bg, "BG", (v) => setTheme({ ...theme, bg: v }))}
                        {colorDot(theme.text, "Text", (v) => setTheme({ ...theme, text: v }))}
                        {colorDot(theme.cardBg, "Card", (v) => setTheme({ ...theme, cardBg: v, pillBg: v }))}
                      </div>
                    )}

                    {/* Radius */}
                    {theme && (
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                        <span className="w-7 shrink-0 font-medium">Radius</span>
                        <input type="range" min="0" max="32" value={parseInt(theme.radius)} onChange={(e) => setTheme({ ...theme, radius: `${e.target.value}px` })} className="flex-1 h-1" />
                        <span className="font-mono w-10 text-right text-[9px]">{theme.radius}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Business info section */}
              <div className="px-4">
                <button
                  onClick={() => setShowBusiness(!showBusiness)}
                  className="flex items-center justify-between w-full py-2 text-left"
                >
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{t.catalogSetupBusiness}</span>
                  <svg className={`w-3 h-3 text-neutral-400 transition-transform ${showBusiness ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showBusiness && info && (
                  <div className="space-y-2 pb-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Name</span>
                      <input value={info.name || ""} onChange={(e) => setInfo({ ...info, name: e.target.value })} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" placeholder="Brand name" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-14 shrink-0 text-neutral-400 pt-0.5">About</span>
                      <textarea value={info.about || ""} onChange={(e) => setInfo({ ...info, about: e.target.value })} rows={2} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800 resize-none text-[10px]" placeholder="Tagline / description" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Phone</span>
                      <input value={info.phone || ""} onChange={(e) => setInfo({ ...info, phone: e.target.value })} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Address</span>
                      <input value={info.address || ""} onChange={(e) => setInfo({ ...info, address: e.target.value })} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Hours</span>
                      <input value={info.hours || ""} onChange={(e) => setInfo({ ...info, hours: e.target.value })} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Maps URL</span>
                      <input value={info.mapsUrl || ""} onChange={(e) => setInfo({ ...info, mapsUrl: e.target.value })} className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-neutral-400">Currency</span>
                      <input value={info.currency || "$"} onChange={(e) => setInfo({ ...info, currency: e.target.value })} className="w-16 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800" placeholder="$" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="w-14 shrink-0 text-neutral-400">Logo</span>
                      <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" id="logo-upload" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploading("logo");
                        try {
                          const form = new FormData(); form.append("file", f);
                          const res = await fetch("/api/upload", { method: "POST", body: form });
                          if (!res.ok) throw new Error("Upload failed");
                          const { url } = await res.json();
                          setInfo({ ...info, logo: url });
                          setTheme(theme ? { ...theme, showLogo: true } : null);
                        } catch { setError("Logo upload failed (Pro plan required)"); }
                        finally { setUploading(null); }
                      }} />
                      <label htmlFor="logo-upload" className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200">
                        {uploading === "logo" ? "..." : info.logo ? "Change" : "Add"}
                      </label>
                      {info.logo && (
                        <>
                          <img src={info.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <button onClick={() => setInfo({ ...info, logo: "" })} className="text-[10px] text-red-400 hover:text-red-600">X</button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Save button sticky at bottom */}
              <div className="mt-auto px-4 py-3 border-t border-neutral-200">
                <button onClick={save} disabled={saving} className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition disabled:opacity-50 active:scale-[0.98]">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* COLUMN 2 — CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {categories.length} categor{lang === "es" ? "ías" : lang === "en" ? "ies" : "ies"}
              </h2>
              <button
                onClick={() => {
                  const c = newCategory();
                  setCategories((prev) => [...prev, c]);
                  setExpandedCat(c.id);
                }}
                className="text-[11px] font-medium px-3 py-1 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition active:scale-[0.97]"
              >
                + Add category
              </button>
            </div>

            {categories.length === 0 && (
              <p className="text-xs text-center py-16 text-neutral-400">
                {showOnboarding ? "Choose a template on the left to get started." : "No categories yet. Add one above."}
              </p>
            )}

            {categories.map((cat, catIdx) => (
              <div key={cat.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
                {/* Category header */}
                <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                  <div className="flex-1 min-w-0">
                    <input
                      value={cat.name}
                      onChange={(e) => {
                        const next = [...categories];
                        next[catIdx] = { ...next[catIdx], name: e.target.value };
                        setCategories(next);
                      }}
                      placeholder="Category name"
                      className="w-full text-sm font-semibold bg-transparent outline-none text-neutral-800"
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
                      className="w-full text-[11px] mt-0.5 bg-transparent outline-none text-neutral-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">{cat.subcategories.length} sub</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!confirm("Delete this category and all its items?")) return;
                      setCategories((prev) => prev.filter((_, i) => i !== catIdx));
                      if (expandedCat === cat.id) setExpandedCat(null);
                    }}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${expandedCat === cat.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {/* Category image */}
                {cat.image && (
                  <div className="px-3 pb-1">
                    <img src={cat.image} alt="" className="h-20 w-full object-cover rounded-md" />
                  </div>
                )}
                <div className="px-3 pb-2 flex items-center gap-2">
                  <label className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200">
                    {uploading === `cat-${catIdx}` ? "..." : cat.image ? "Change image" : "Add image"}
                    <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, catIdx); }} />
                  </label>
                  {cat.image && (
                    <button onClick={() => { const next = [...categories]; next[catIdx] = { ...next[catIdx], image: "" }; setCategories(next); }} className="text-[10px] text-red-400 hover:text-red-600">Remove</button>
                  )}
                </div>

                {/* Subcategories */}
                {expandedCat === cat.id && (
                  <div className="border-t border-neutral-200">
                    <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-neutral-500">Subcategories</span>
                        <button
                          onClick={() => {
                            const next = [...categories];
                            const sub = newSubcategory();
                            next[catIdx] = { ...next[catIdx], subcategories: [...next[catIdx].subcategories, sub] };
                            setCategories(next);
                            setExpandedSub(sub.id);
                          }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        >
                          + Subcategory
                        </button>
                      </div>

                      {cat.subcategories.length === 0 && (
                        <p className="text-[11px] text-center py-4 text-neutral-400">No subcategories yet.</p>
                      )}

                      {cat.subcategories.map((sub, subIdx) => (
                        <div key={sub.id} className="border border-neutral-200 rounded-md">
                          <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}>
                            <input
                              value={sub.name}
                              onChange={(e) => {
                                const next = structuredClone(categories) as Category[];
                                next[catIdx].subcategories[subIdx].name = e.target.value;
                                setCategories(next);
                              }}
                              placeholder="Subcategory name"
                              className="flex-1 text-[11px] font-medium bg-transparent outline-none text-neutral-800"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-[10px] text-neutral-400">{sub.items.length} items</span>
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
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <svg className={`w-3 h-3 text-neutral-400 transition-transform ${expandedSub === sub.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>

                          {expandedSub === sub.id && (
                            <div className="border-t border-neutral-200 p-2 space-y-2">
                              <button
                                onClick={() => {
                                  const next = structuredClone(categories) as Category[];
                                  next[catIdx].subcategories[subIdx].items.push(newItem());
                                  setCategories(next);
                                }}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                              >
                                + Add Item
                              </button>

                              {sub.items.length === 0 && (
                                <p className="text-[10px] text-center py-3 text-neutral-400">No items yet.</p>
                              )}

                              {sub.items.map((item, itemIdx) => (
                                <div key={item.id} className="border border-neutral-100 rounded p-2 space-y-1.5">
                                  <div className="flex gap-2">
                                    <input
                                      value={item.name}
                                      onChange={(e) => {
                                        const next = structuredClone(categories) as Category[];
                                        next[catIdx].subcategories[subIdx].items[itemIdx].name = e.target.value;
                                        setCategories(next);
                                      }}
                                      placeholder="Item name"
                                      className="flex-1 text-[11px] font-medium bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 outline-none px-0.5 py-0.5 text-neutral-800"
                                    />
                                    <input
                                      value={item.price}
                                      onChange={(e) => {
                                        const next = structuredClone(categories) as Category[];
                                        next[catIdx].subcategories[subIdx].items[itemIdx].price = e.target.value;
                                        setCategories(next);
                                      }}
                                      placeholder="$0.00"
                                      className="w-16 text-[11px] font-semibold text-right bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 outline-none px-0.5 py-0.5 text-neutral-700"
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
                                    className="w-full text-[10px] bg-transparent border border-transparent hover:border-neutral-200 focus:border-neutral-300 outline-none rounded px-1 py-0.5 resize-none text-neutral-500"
                                  />
                                  <div className="flex gap-1.5 flex-wrap">
                                    <input value={item.tag || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].tag = e.target.value; setCategories(next); }} placeholder="Tag" className="text-[9px] bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 outline-none px-0.5 py-0.5 w-20 text-neutral-500" />
                                    <input value={item.kcal || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].kcal = e.target.value; setCategories(next); }} placeholder="kcal" className="text-[9px] bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 outline-none px-0.5 py-0.5 w-12 text-neutral-500" />
                                    <input value={item.time || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].time = e.target.value; setCategories(next); }} placeholder="min" className="text-[9px] bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 outline-none px-0.5 py-0.5 w-12 text-neutral-500" />
                                  </div>
                                  {item.image && <img src={item.image} alt="" className="h-12 w-12 object-cover rounded" />}
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200">
                                      {uploading === `item-${catIdx}-${subIdx}-${itemIdx}` ? "..." : item.image ? "Change" : "Img"}
                                      <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleItemImageUpload(f, catIdx, subIdx, itemIdx); }} />
                                    </label>
                                    {item.image && (
                                      <button onClick={() => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].image = ""; setCategories(next); }} className="text-[9px] text-red-400 hover:text-red-600">X</button>
                                    )}
                                    <button onClick={() => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items.splice(itemIdx, 1); setCategories(next); }} className="text-[9px] text-red-400 hover:text-red-600 ml-auto">Delete</button>
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
        </main>

        {/* COLUMN 3 — PREVIEW */}
        <aside className="flex-1 overflow-hidden border-l border-neutral-200 bg-white flex-col hidden lg:flex">
          <div className="shrink-0 h-10 flex items-center justify-between px-3 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`text-[10px] px-2 py-1 rounded ${previewDevice === "mobile" ? "bg-neutral-200 text-neutral-800 font-medium" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`text-[10px] px-2 py-1 rounded ${previewDevice === "desktop" ? "bg-neutral-200 text-neutral-800 font-medium" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                Desktop
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => previewRef.current?.contentWindow?.postMessage({ type: "catalog-preview-update", categories, info, theme }, window.location.origin)}
                className="text-[10px] px-2 py-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200"
                title="Refresh"
              >
                ↻
              </button>
              <a href={`/c/${qrId}`} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200" title="Open in new tab">↗</a>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-neutral-100 flex items-stretch justify-center">
            <iframe
              ref={previewRef}
              src={`/c/${qrId}?preview=1`}
              className="w-full h-full bg-white"
              style={{ maxWidth: previewDevice === "mobile" ? "380px" : "100%" }}
              title="Preview"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}