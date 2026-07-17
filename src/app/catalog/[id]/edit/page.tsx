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
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showBusinessExtra, setShowBusinessExtra] = useState(false);
  const [showThemePopover, setShowThemePopover] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
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

  const toggleItemExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey); else next.add(itemKey);
      return next;
    });
  };

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

          {/* Theme dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemePopover(!showThemePopover)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition"
            >
              <span className="w-3.5 h-3.5 rounded-sm border border-neutral-300" style={{ background: theme?.accent || "#c97b5e" }} />
              Theme
              <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showThemePopover && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowThemePopover(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-xl border border-neutral-200 p-3 min-w-[140px]">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {PRESET_THEMES.map((p, idx) => {
                      const isActive = theme && theme.accent === p.accent && theme.bg === p.bg;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setTheme({ ...p, showLogo: p.showLogo }); setShowThemePopover(false); }}
                          className={`w-9 h-9 rounded-lg border-2 flex flex-col overflow-hidden ${isActive ? "border-neutral-800 shadow-sm" : "border-transparent hover:border-neutral-300"}`}
                        >
                          <div className="flex-1" style={{ background: p.bg }} />
                          <div className="h-2" style={{ background: p.accent }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={save} disabled={saving} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition disabled:opacity-50">
            {saving ? "..." : "Save"}
          </button>
        </div>
      </header>

      {/* 2-COLUMN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* Onboarding (full-width if shown) */}
        {showOnboarding ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-md mx-auto p-8 space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-neutral-800">{t.catalogOnboardingTitle}</h2>
                <p className="text-sm text-neutral-500 mt-1">{t.catalogOnboardingSubtitle}</p>
              </div>
              <div className="space-y-3">
                {ONBOARDING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => applyTemplate(opt.id)}
                    className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all active:scale-[0.98] group bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl shrink-0">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-neutral-800">{(t as any)[opt.key]}</p>
                          {opt.count && <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">{opt.count}</span>}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{(t as any)[opt.descKey]}</p>
                      </div>
                      <svg className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 mt-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* LEFT COLUMN — EDITOR */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
                {/* BUSINESS INFO — always visible */}
                {info && (
                  <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t.catalogSetupBusiness}</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" id="logo-upload-main" onChange={async (e) => {
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
                        <label htmlFor="logo-upload-main" className="cursor-pointer">
                          {info.logo ? (
                            <img src={info.logo} alt="" className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs">Logo</div>
                          )}
                        </label>
                      </div>
                      <input
                        value={info.name || ""}
                        onChange={(e) => setInfo({ ...info, name: e.target.value })}
                        placeholder="Business name"
                        className="flex-1 text-sm font-semibold bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-800"
                      />
                      <input
                        value={info.phone || ""}
                        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                        placeholder="Phone"
                        className="w-36 text-xs bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600"
                      />
                    </div>
                    <button onClick={() => setShowBusinessExtra(!showBusinessExtra)} className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600">
                      {showBusinessExtra ? "− Hide details" : "+ Address, hours, about..."}
                    </button>
                    {showBusinessExtra && (
                      <div className="space-y-2 text-xs pt-1">
                        <div className="flex gap-2">
                          <input value={info.address || ""} onChange={(e) => setInfo({ ...info, address: e.target.value })} placeholder="Address" className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600" />
                          <input value={info.hours || ""} onChange={(e) => setInfo({ ...info, hours: e.target.value })} placeholder="Hours (e.g. Mon-Sun 12-23)" className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600" />
                        </div>
                        <div className="flex gap-2">
                          <input value={info.mapsUrl || ""} onChange={(e) => setInfo({ ...info, mapsUrl: e.target.value })} placeholder="Google Maps URL" className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600" />
                          <input value={info.currency || "$"} onChange={(e) => setInfo({ ...info, currency: e.target.value })} placeholder="$" className="w-20 bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600" />
                        </div>
                        <textarea value={info.about || ""} onChange={(e) => setInfo({ ...info, about: e.target.value })} rows={2} placeholder="About your business (shown in the menu header)" className="w-full text-xs bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-1 text-neutral-600 resize-none" />
                      </div>
                    )}
                  </div>
                )}

                {/* CATEGORIES */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {categories.length} {categories.length === 1 ? "category" : "categories"}
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

                {categories.map((cat, catIdx) => {
                  const totalItems = cat.subcategories.reduce((s, sc) => s + sc.items.length, 0);
                  return (
                    <div key={cat.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                      {/* Category header */}
                      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                        <div className="flex-1 min-w-0">
                          <input
                            value={cat.name}
                            onChange={(e) => { const next = [...categories]; next[catIdx] = { ...next[catIdx], name: e.target.value }; setCategories(next); }}
                            placeholder="Category name"
                            className="w-full text-sm font-semibold bg-transparent outline-none text-neutral-800"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <input
                            value={cat.desc}
                            onChange={(e) => { const next = [...categories]; next[catIdx] = { ...next[catIdx], desc: e.target.value }; setCategories(next); }}
                            placeholder="Short description"
                            className="w-full text-[11px] mt-0.5 bg-transparent outline-none text-neutral-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400">{cat.subcategories.length} sub · {totalItems} items</span>
                        <button onClick={(e) => { e.stopPropagation(); if (!confirm("Delete this category?")) return; setCategories((prev) => prev.filter((_, i) => i !== catIdx)); if (expandedCat === cat.id) setExpandedCat(null); }} className="text-red-400 hover:text-red-600 transition shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform shrink-0 ${expandedCat === cat.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>

                      {/* Category image */}
                      {cat.image && (
                        <div className="px-3 pb-1">
                          <img src={cat.image} alt="" className="h-24 w-full object-cover rounded-lg" />
                        </div>
                      )}
                      <div className="px-3 pb-3 flex items-center gap-2">
                        <label className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200">
                          {uploading === `cat-${catIdx}` ? "..." : cat.image ? "Change image" : "Add cover image"}
                          <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, catIdx); }} />
                        </label>
                        {cat.image && (
                          <button onClick={() => { const next = [...categories]; next[catIdx] = { ...next[catIdx], image: "" }; setCategories(next); }} className="text-[10px] text-red-400 hover:text-red-600">Remove</button>
                        )}
                      </div>

                      {/* Subcategories — always visible when category expanded */}
                      {expandedCat === cat.id && (
                        <div className="border-t border-neutral-200">
                          <div className="p-3 space-y-4">
                            {cat.subcategories.map((sub, subIdx) => (
                              <div key={sub.id}>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    value={sub.name}
                                    onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].name = e.target.value; setCategories(next); }}
                                    placeholder="Section name (e.g. Burgers, Drinks...)"
                                    className="flex-1 text-xs font-semibold bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-700"
                                  />
                                  <span className="text-[10px] text-neutral-400">{sub.items.length}</span>
                                  <button onClick={() => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items.push(newItem()); setCategories(next); }} className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200 shrink-0">+ Item</button>
                                  <button onClick={() => { if (!confirm("Delete section?")) return; const next = structuredClone(categories) as Category[]; next[catIdx].subcategories.splice(subIdx, 1); setCategories(next); }} className="text-red-400 hover:text-red-600 shrink-0">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </div>

                                {/* Items list */}
                                <div className="space-y-1.5 ml-2 border-l-2 border-neutral-100 pl-3">
                                  {sub.items.map((item, itemIdx) => {
                                    const itemKey = `${catIdx}-${subIdx}-${itemIdx}`;
                                    const isExpanded = expandedItems.has(itemKey);
                                    return (
                                      <div key={item.id} className="group">
                                        <div className="flex items-center gap-2 py-0.5">
                                          {/* Item image thumbnail */}
                                          <label className="cursor-pointer shrink-0">
                                            <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleItemImageUpload(f, catIdx, subIdx, itemIdx); }} />
                                            {item.image ? (
                                              <img src={item.image} alt="" className="w-8 h-8 rounded object-cover border border-neutral-200" />
                                            ) : (
                                              <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-300">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                              </div>
                                            )}
                                          </label>
                                          <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-1 items-center">
                                            <input
                                              value={item.name}
                                              onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].name = e.target.value; setCategories(next); }}
                                              placeholder="Item name"
                                              className="w-full text-[11px] bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-800 font-medium"
                                            />
                                            <input
                                              value={item.price}
                                              onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].price = e.target.value; setCategories(next); }}
                                              placeholder="$0.00"
                                              className="w-16 text-right text-[11px] font-semibold bg-transparent outline-none border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 py-0.5 text-neutral-600"
                                            />
                                          </div>
                                          <button onClick={() => toggleItemExpanded(itemKey)} className="text-neutral-300 hover:text-neutral-500 shrink-0" title="More options">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                          </button>
                                          <button onClick={() => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items.splice(itemIdx, 1); setCategories(next); }} className="text-red-300 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                        </div>
                                        {/* Expanded: description, tag, kcal, time */}
                                        {isExpanded && (
                                          <div className="ml-10 mb-1.5 space-y-1.5">
                                            <textarea
                                              value={item.desc}
                                              onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].desc = e.target.value; setCategories(next); }}
                                              placeholder="Description"
                                              rows={2}
                                              className="w-full text-[10px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 resize-none outline-none focus:border-neutral-400 text-neutral-500"
                                            />
                                            <div className="flex gap-2 flex-wrap">
                                              <input value={item.tag || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].tag = e.target.value; setCategories(next); }} placeholder="Tag (e.g. Popular)" className="text-[10px] bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 outline-none focus:border-neutral-400 w-28 text-neutral-500" />
                                              <input value={item.kcal || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].kcal = e.target.value; setCategories(next); }} placeholder="kcal" className="text-[10px] bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 outline-none focus:border-neutral-400 w-16 text-neutral-500" />
                                              <input value={item.time || ""} onChange={(e) => { const next = structuredClone(categories) as Category[]; next[catIdx].subcategories[subIdx].items[itemIdx].time = e.target.value; setCategories(next); }} placeholder="min" className="text-[10px] bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 outline-none focus:border-neutral-400 w-14 text-neutral-500" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {sub.items.length === 0 && (
                                    <p className="text-[10px] text-neutral-400 py-2">No items yet. Click &quot;+ Item&quot; above.</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {cat.subcategories.length === 0 && (
                              <p className="text-[11px] text-neutral-400 py-3">No sections yet.</p>
                            )}
                            <button
                              onClick={() => {
                                const next = [...categories];
                                const sub = newSubcategory();
                                next[catIdx] = { ...next[catIdx], subcategories: [...next[catIdx].subcategories, sub] };
                                setCategories(next);
                              }}
                              className="text-[10px] font-medium px-2 py-1 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            >
                              + Add section
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN — PREVIEW */}
            <aside className="w-[40%] shrink-0 overflow-hidden border-l border-neutral-200 bg-white flex-col hidden lg:flex">
              <div className="shrink-0 h-10 flex items-center justify-between px-3 border-b border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-1">
                  <button onClick={() => setPreviewDevice("mobile")} className={`text-[10px] px-2 py-1 rounded ${previewDevice === "mobile" ? "bg-neutral-200 text-neutral-800 font-medium" : "text-neutral-400 hover:text-neutral-600"}`}>Mobile</button>
                  <button onClick={() => setPreviewDevice("desktop")} className={`text-[10px] px-2 py-1 rounded ${previewDevice === "desktop" ? "bg-neutral-200 text-neutral-800 font-medium" : "text-neutral-400 hover:text-neutral-600"}`}>Desktop</button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => previewRef.current?.contentWindow?.postMessage({ type: "catalog-preview-update", categories, info, theme }, window.location.origin)} className="text-[10px] px-2 py-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200" title="Refresh">↻</button>
                  <a href={`/c/${qrId}`} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200" title="Open in new tab">↗</a>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-neutral-100 flex items-stretch justify-center">
                <iframe ref={previewRef} src={`/c/${qrId}?preview=1`} className="w-full h-full bg-white" style={{ maxWidth: previewDevice === "mobile" ? "380px" : "100%" }} title="Preview" />
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}