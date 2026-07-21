"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTheme, themeToCssVars } from "@/lib/catalog-theme";

interface CatalogItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  tag?: string;
  kcal?: string;
  time?: string;
}
interface CatalogSubcategory {
  id: string;
  name: string;
  items: CatalogItem[];
}
interface CatalogCategory {
  id: string;
  name: string;
  image: string;
  desc: string;
  subcategories: CatalogSubcategory[];
}
interface CatalogInfo {
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

export default function CatalogPage() {
  const params = useParams();
  const qrId = params.id as string;
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const [cats, setCats] = useState<CatalogCategory[]>([]);
  const [info, setInfo] = useState<CatalogInfo | null>(null);
  const [theme, setTheme] = useState<any>(null);
  const [fonts, setFonts] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("");
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string>("");
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const modalSubsScrollRef = useRef<HTMLDivElement>(null);
  const modalSectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const modalPillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (isPreview) {
      setLoaded(true);
      return;
    }
    fetch(`/api/catalog/${qrId}`)
      .then((r) => r.json())
      .then((data) => {
        setCats(data.categories || []);
        setInfo(data.info || null);
        setTheme(data.theme || null);
        setFonts(data.fonts || []);
        setLoaded(true);
        const subs = data.categories || [];
        if (subs.length) {
          setActiveCat(subs[0].id);
          if (subs[0].subcategories?.length) setActiveSub(subs[0].subcategories[0].id);
        }
      });
  }, [qrId, isPreview]);

  useEffect(() => {
    if (!isPreview) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "catalog-preview-update") {
        setCats(e.data.categories || []);
        setInfo(e.data.info || null);
        setTheme(e.data.theme || null);
        const subs = e.data.categories || [];
        if (subs.length) {
          setActiveCat(subs[0].id);
          if (subs[0].subcategories?.length) setActiveSub(subs[0].subcategories[0].id);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isPreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.hash.match(/^#cat-([\w-]+)$/);
    if (m && m[1] && cats.length) {
      const target = cats.find((c) => c.id === m[1]);
      if (target) {
        setOpenCatId(target.id);
        if (target.subcategories?.length) setActiveSub(target.subcategories[0].id);
      }
    }
  }, [cats, loaded]);

  const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);
  const setModalSectionRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) modalSectionRefs.current.set(id, el);
    else modalSectionRefs.current.delete(id);
  }, []);
  const setModalPillRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) modalPillRefs.current.set(id, el);
    else modalPillRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!cats.length || openCatId) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-cat-id");
            if (id) {
              setActiveCat(id);
            }
          }
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 }
    );
    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cats, loaded, openCatId]);

  useEffect(() => {
    if (!openCatId) return;
    const cat = cats.find((c) => c.id === openCatId);
    if (!cat?.subcategories?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-modal-sub-id");
            if (id) {
              setActiveSub(id);
              modalPillRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
          }
        }
      },
      { rootMargin: "-160px 0px -55% 0px", threshold: 0 }
    );
    modalSectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [openCatId, cats]);

  const openCat = (id: string) => {
    const cat = cats.find((c) => c.id === id);
    if (!cat) return;
    setOpenCatId(id);
    if (cat.subcategories?.length) setActiveSub(cat.subcategories[0].id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#cat-${id}`);
      document.body.style.overflow = "hidden";
    }
  };

  const closeCat = () => {
    setOpenCatId(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
      document.body.style.overflow = "";
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f0eb" }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#c97b5e transparent transparent transparent" }} />
      </div>
    );
  }

  const t = getTheme(theme);
  const cssVars = themeToCssVars(t);
  const currency = info?.currency || "$";
  const openCatObj = openCatId ? cats.find((c) => c.id === openCatId) || null : null;

  return (
    <div className="min-h-screen" style={{ ...cssVars, fontFamily: t.font || "system-ui" }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(" ", "+")}`).join("&")}&display=swap`} />
      )}
      <header className="sticky top-0 z-20" style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            {(info?.logo) ? (
              <img
                src={info.logo}
                alt={info?.name || "Logo"}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                style={{ border: `1px solid ${t.border}` }}
              />
            ) : (
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: t.accent }}
              >
                {(info?.name || "M").charAt(0).toUpperCase()}
              </div>
            )}
            {info?.name ? (
              <span className="font-semibold text-sm truncate max-w-[120px]" style={{ color: t.text }}>
                {info.name}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: t.text }}>
            {info?.name ? `${info.name}` : "Our Menu"}
          </h1>
          {info?.about ? (
            <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: t.muted }}>
              {info.about}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cats.map((cat) => {
            const totalItems = cat.subcategories.reduce((s, sc) => s + sc.items.length, 0);
            return (
              <div
                key={cat.id}
                id={`cat-${cat.id}`}
                ref={(el) => setCardRef(cat.id, el)}
                data-cat-id={cat.id}
                className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: t.cardBg,
                  borderColor: t.border,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  borderRadius: t.radius,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    openCat(cat.id);
                  }}
                  className="relative overflow-hidden block aspect-[4/3] w-full"
                  style={{ cursor: "zoom-in" }}
                  aria-label={`Open ${cat.name}`}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: t.bg, opacity: 0.5 }}>
                      <svg className="w-10 h-10 opacity-30" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span
                    className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow"
                    style={{ backgroundColor: t.accent, color: t.accentText }}
                  >
                    {totalItems} items
                  </span>
                </button>
                <div className="p-3.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate" style={{ color: t.text }}>{cat.name}</h2>
                    {cat.desc ? (
                      <p className="text-xs mt-0.5 leading-relaxed truncate" style={{ color: t.muted }}>{cat.desc}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => openCat(cat.id)}
                    className="text-xs font-medium whitespace-nowrap"
                    style={{ color: t.accent }}
                  >
                    Open →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {info && (info.phone || info.address || info.hours || info.mapsUrl) && (
          <footer
            className="mt-10 p-5 rounded-2xl border space-y-3 text-sm"
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
              <a
                href={info.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 font-medium text-xs tracking-wide uppercase"
                style={{ color: t.accent }}
              >
                Open in Google Maps
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
          </footer>
        )}
      </main>

      {openCatObj && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: t.bg, fontFamily: t.font || "system-ui" }}>
          <div className="relative h-44 sm:h-56 overflow-hidden">
            {openCatObj.image ? (
              <img src={openCatObj.image} alt={openCatObj.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: t.accent, opacity: 0.3 }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              type="button"
              onClick={closeCat}
              className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
              aria-label="Back"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <Link
              href={`/c/${qrId}/cat/${openCatObj.id}`}
              className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", color: "#fff" }}
              title="Open in dedicated page"
            >
              Full page →
            </Link>
            <div className="absolute bottom-4 left-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{openCatObj.name}</h1>
              {openCatObj.desc ? <p className="text-xs sm:text-sm text-white/80 mt-0.5">{openCatObj.desc}</p> : null}
            </div>
          </div>

          <div
            ref={modalSubsScrollRef}
            className="sticky top-0 z-10 overflow-x-auto whitespace-nowrap px-4 py-3"
            style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}
          >
            <div className="flex gap-2 max-w-4xl mx-auto">
              {openCatObj.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  ref={(el) => setModalPillRef(sub.id, el)}
                  type="button"
                  onClick={() => {
                    setActiveSub(sub.id);
                    document.getElementById(`modal-sub-${sub.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap"
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

          <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
            {openCatObj.subcategories.map((sub) => (
              <div
                key={sub.id}
                id={`modal-sub-${sub.id}`}
                ref={(el) => setModalSectionRef(sub.id, el)}
                data-modal-sub-id={sub.id}
              >
                <h2 className="text-sm font-semibold mb-3 px-1" style={{ color: t.text }}>
                  {sub.name}
                  <span className="ml-2 text-xs font-normal" style={{ color: t.muted }}>{sub.items.length} items</span>
                </h2>
                <div className="space-y-3">
                  {sub.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 border transition-all"
                      style={{
                        backgroundColor: t.cardBg,
                        borderColor: t.border,
                        borderRadius: t.radius,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {item.image ? (
                        <div className="w-20 h-20 shrink-0 overflow-hidden" style={{ borderRadius: "10px" }}>
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
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.muted }}>{item.kcal} kcal</span>
                          ) : null}
                          {item.time ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.muted }}>{item.time} min</span>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
