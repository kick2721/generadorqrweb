"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getT } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

const OPTIONS = [
  {
    id: "restaurant",
    emoji: "🍽️",
    key: "catalogOnboardingRestaurant",
    descKey: "catalogOnboardingRestaurantDesc",
    color: "#f59e0b",
    colorBg: "#fef3c7",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    glow: "rgba(245,158,11,0.30)",
    tag: "Más popular",
    tagColor: "#f59e0b",
    tagBg: "#fef3c7",
  },
  {
    id: "products",
    emoji: "📦",
    key: "catalogOnboardingProducts",
    descKey: "catalogOnboardingProductsDesc",
    color: "#10b981",
    colorBg: "#d1fae5",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "rgba(16,185,129,0.30)",
    tag: "Para tiendas",
    tagColor: "#10b981",
    tagBg: "#d1fae5",
  },
  {
    id: "services",
    emoji: "💼",
    key: "catalogOnboardingServices",
    descKey: "catalogOnboardingServicesDesc",
    color: "#6366f1",
    colorBg: "#e0e7ff",
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
    glow: "rgba(99,102,241,0.30)",
    tag: "Para profesionales",
    tagColor: "#6366f1",
    tagBg: "#e0e7ff",
  },
  {
    id: "blank",
    emoji: "✨",
    key: "catalogOnboardingBlank",
    descKey: "catalogOnboardingBlankDesc",
    color: "#6b7280",
    colorBg: "#f3f4f6",
    gradient: "from-neutral-400 via-neutral-500 to-stone-500",
    glow: "rgba(107,114,128,0.20)",
    tag: "Desde cero",
    tagColor: "#6b7280",
    tagBg: "#f3f4f6",
  },
];

const BANDS = [
  { top: "2%", height: "160px", rotate: "-5deg", bg: "linear-gradient(90deg, #fef3c7, #fde68a, #fcd34d)", opacity: 0.08, anim: "band-scroll-right 50s linear infinite" },
  { top: "35%", height: "140px", rotate: "3deg", bg: "linear-gradient(90deg, #d1fae5, #a7f3d0, #6ee7b7)", opacity: 0.07, anim: "band-scroll-left 35s linear infinite" },
  { top: "auto", bottom: "8%", height: "130px", rotate: "-3deg", bg: "linear-gradient(90deg, #e0e7ff, #c7d2fe, #a5b4fc)", opacity: 0.06, anim: "band-scroll-right 40s linear infinite" },
];

export default function NewCatalogPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = getT(lang);
  const [creating, setCreating] = useState("");

  const create = async (template: string) => {
    if (creating) return;
    setCreating(template);
    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: [], template, fonts: [] }),
      });
      const data = await res.json();
      if (data.qrId) router.replace(`/catalog/${data.qrId}/edit`);
      else router.replace("/dashboard?error=catalog-create-failed");
    } catch {
      router.replace("/dashboard?error=catalog-create-failed");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fdfbf7 0%, #f7f3ed 30%, #f0ebe3 70%, #ede7dd 100%)" }}>
      {/* Noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.012, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px 256px" }} />

      {/* ===== DIAGONAL DECORATIVE BANDS (gradient-only, no images) ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {BANDS.map((band, bi) => (
          <div key={bi} className="absolute left-[-5%] w-[160%]" style={{ top: band.top, bottom: band.bottom, height: band.height, transform: `rotate(${band.rotate})`, transformOrigin: "center center" }}>
            <div className="w-full h-full" style={{ background: band.bg, opacity: band.opacity, borderRadius: "999px" }} />
          </div>
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Back button */}
        <div className="mb-4">
          <button onClick={() => router.push("/")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-white/60 rounded-xl transition" title="Back to home">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>

        {creating !== "" ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-white shadow-xl border border-neutral-100 flex items-center justify-center" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                <span className="text-3xl animate-bounce">{OPTIONS.find((o) => o.id === creating)?.emoji || "✨"}</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-400 border-[3px] border-white flex items-center justify-center shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <p className="text-sm text-neutral-500 animate-pulse font-medium">Creando tu catálogo...</p>
          </div>
        ) : (
          <>
            {/* ====== HERO SECTION ====== */}
            <section className="text-center mb-10 sm:mb-14">
              {/* Icon box */}
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-lg border border-neutral-100 mb-6" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
                {/* Decorative catalog icon SVG */}
                <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="17" height="17" rx="3" fill="url(#g1)" />
                  <rect x="27" y="4" width="17" height="17" rx="3" fill="url(#g2)" />
                  <rect x="4" y="27" width="17" height="17" rx="3" fill="url(#g3)" />
                  <rect x="27" y="27" width="17" height="17" rx="3" fill="url(#g4)" />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#ef4444" /></linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#10b981" /><stop offset="1" stopColor="#06b6d4" /></linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient>
                    <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#f43f5e" /></linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3 leading-tight">
                {t.catalogOnboardingTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-neutral-500 max-w-lg mx-auto leading-relaxed mb-3">
                {t.catalogOnboardingSubtitle}
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
              </div>
            </section>

            {/* ====== CARDS SECTION ====== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => create(opt.id)}
                  className="group relative text-left p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 hover:border-transparent transition-all duration-500 active:scale-[0.98] overflow-hidden"
                  style={{
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 40px ${opt.glow}, 0 2px 8px rgba(0,0,0,0.06)`;
                    e.currentTarget.style.borderColor = opt.color + "40";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Top gradient bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, transparent, ${opt.color}, transparent)` }} />

                  {/* Decorative background shape */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none" style={{ background: opt.color }} />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none" style={{ background: opt.color }} />

                  <div className="relative flex items-start gap-4 sm:gap-5">
                    {/* Emoji circle with gradient ring */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-500" style={{ background: opt.colorBg }}>
                        <span className="text-2xl sm:text-3xl transition-transform duration-500 group-hover:scale-110">{opt.emoji}</span>
                      </div>
                      {/* Glow ring on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `0 0 0 3px ${opt.color}30, 0 0 20px ${opt.color}20` }} />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                          {(t as any)[opt.key]}
                        </h3>
                        {/* Tag badge */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: opt.tagBg, color: opt.tagColor }}>
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                        {(t as any)[opt.descKey]}
                      </p>

                      {/* Feature dots */}
                      <div className="flex items-center gap-3 mt-3">
                        {opt.id === "restaurant" && (
                          <>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> Fotos incluidas</span>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> 86 platos</span>
                          </>
                        )}
                        {opt.id === "products" && (
                          <>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> 4 categorías</span>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> 46 productos</span>
                          </>
                        )}
                        {opt.id === "services" && (
                          <>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> 4 categorías</span>
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> 43 servicios</span>
                          </>
                        )}
                        {opt.id === "blank" && (
                          <span className="flex items-center gap-1 text-[10px] text-neutral-400"><span className="w-1 h-1 rounded-full" style={{ background: opt.color }} /> Tú decides el contenido</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 mt-1" style={{ background: "#f9fafb" }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 text-neutral-300 group-hover:translate-x-1" style={{ color: "#d1d5db" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </section>
          </>
        )}
      </div>


    </div>
  );
}