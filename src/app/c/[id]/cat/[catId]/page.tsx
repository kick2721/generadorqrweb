"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTheme, themeToCssVars } from "@/lib/catalog-theme";
import { getT, type Lang } from "@/lib/i18n";

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
  phone?: string;
  address?: string;
  hours?: string;
  mapsUrl?: string;
  name?: string;
  logo?: string;
  currency?: string;
  language?: string;
  about?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const qrId = params.id as string;
  const catId = params.catId as string;

  const [cat, setCat] = useState<Category | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [theme, setTheme] = useState<any>(null);
  const [fonts, setFonts] = useState<string[]>([]);
  const [activeSub, setActiveSub] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/catalog/${qrId}`)
      .then((r) => r.json())
      .then((data) => {
        const found = (data.categories || []).find((c: Category) => c.id === catId);
        setCat(found || null);
        setInfo(data.info || null);
        setTheme(data.theme || null);
        setFonts(data.fonts || []);
        setLoaded(true);
        if (found?.subcategories?.length) {
          setActiveSub(found.subcategories[0].id);
        }
      });
  }, [qrId, catId]);

  const setRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  }, []);

  const setPillRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) pillRefs.current.set(id, el);
    else pillRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!cat?.subcategories?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-sub-id");
            if (id) {
              setActiveSub(id);
              pillRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cat, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f0eb" }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#c97b5e #c97b5e transparent transparent" }} />
      </div>
    );
  }

  const tCat = getT((info?.language as Lang) || "en");

  if (!cat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#f5f0eb" }}>
        <p className="text-sm" style={{ color: "#8a7a64" }}>{tCat.catalogCategoryNotFound}</p>
        <Link href={`/c/${qrId}`} className="text-xs font-medium" style={{ color: "#c97b5e" }}>{tCat.catalogBackToMenu}</Link>
      </div>
    );
  }

  const t = getTheme(theme);
  const cssVars = themeToCssVars(t);
  const currency = info?.currency || "$";

  return (
    <div className="min-h-screen" style={{ ...cssVars, fontFamily: t.font || "system-ui" }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(" ", "+")}`).join("&")}&display=swap`} />
      )}
      <div className="relative h-44 overflow-hidden">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Link
            href={`/c/${qrId}`}
            className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="absolute bottom-4 left-4">
            <h1 className="text-xl font-bold text-white">{cat.name}</h1>
            {cat.desc ? <p className="text-xs text-white/80 mt-0.5">{cat.desc}</p> : null}
          </div>
        </div>

        <div ref={scrollContainerRef} className="sticky top-0 z-10 overflow-x-auto whitespace-nowrap px-4 py-3" style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}>
          <div className="flex gap-2">
            {cat.subcategories.map((sub) => (
              <button
                key={sub.id}
                ref={(el) => setPillRef(sub.id, el)}
                onClick={() => {
                  setActiveSub(sub.id);
                  document.getElementById(`sub-${sub.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeSub === sub.id ? "shadow-sm" : "opacity-60 hover:opacity-90"}`}
                style={{
                  background: activeSub === sub.id ? t.pillActiveBg : t.pillBg,
                  color: activeSub === sub.id ? t.pillActiveText : t.pillText,
                  border: activeSub === sub.id ? "none" : `1px solid ${t.border}`,
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-3 pb-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCat.catalogSearch}
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all"
              style={{ background: t.cardBg, borderColor: t.border, color: t.text }}
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: t.muted }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            ) : null}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
          {cat.subcategories.map((sub) => {
            const q = searchQuery.toLowerCase().trim();
            const matchingItems = q ? sub.items.filter((item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)) : sub.items;
            if (q && matchingItems.length === 0) return null;
            return (
              <div key={sub.id} id={`sub-${sub.id}`} ref={(el) => setRef(sub.id, el)} data-sub-id={sub.id}>
                <h2 className="text-sm font-semibold mb-3 px-1" style={{ color: t.text }}>
                  {sub.name}
                  <span className="ml-2 text-xs font-normal" style={{ color: t.muted }}>{tCat.catalogItems.replace("{n}", String(matchingItems.length))}</span>
                </h2>
                <div className="space-y-3">
                  {(q ? matchingItems : sub.items).map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-2xl border transition-all"
                      style={{
                        backgroundColor: t.cardBg,
                        borderColor: t.border,
                        borderRadius: t.radius,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {item.image ? (
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                          <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm" style={{ color: t.text }}>{item.name}</h3>
                          {item.price ? (
                            <span className="font-semibold text-xs whitespace-nowrap" style={{ color: t.accent }}>{currency}{item.price}</span>
                          ) : null}
                        </div>
                        {item.desc ? (
                          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: t.muted }}>{item.desc}</p>
                        ) : null}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {item.kcal ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.muted }}>{item.kcal} {tCat.catalogKcal}</span>
                          ) : null}
                          {item.time ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.muted }}>{item.time} {tCat.catalogMin}</span>
                          ) : null}
                          {item.tag ? (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: t.accent + "22", color: t.accent }}
                            >
                              {item.tag}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {searchQuery.trim() && cat.subcategories.every((sub) => {
            const q = searchQuery.toLowerCase().trim();
            return !sub.items.some((item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));
          }) ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: t.muted }}>{tCat.catalogNoResults.replace("{query}", searchQuery.trim())}</p>
            </div>
          ) : null}
        </div>

        {info && (info.phone || info.address || info.hours || info.mapsUrl) && (
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <div
              className="p-5 rounded-2xl border space-y-3 text-sm"
              style={{
                backgroundColor: t.cardBg,
                borderColor: t.border,
                borderRadius: t.radius,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              {info.phone && (
                <p className="flex items-center gap-2.5" style={{ color: t.muted }}>
                  <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {info.phone}
                </p>
              )}
              {info.address && (
                <p className="flex items-center gap-2.5" style={{ color: t.muted }}>
                  <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {info.address}
                </p>
              )}
              {info.hours && (
                <p className="flex items-center gap-2.5" style={{ color: t.muted }}>
                  <svg className="w-4 h-4 shrink-0" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {info.hours}
                </p>
              )}
              {info.mapsUrl && (
                <a href={info.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 font-medium text-xs tracking-wide uppercase" style={{ color: t.accent }}>
                  {tCat.catalogOpenMaps}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
