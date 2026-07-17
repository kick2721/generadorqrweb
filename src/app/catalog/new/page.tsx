"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getT } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

const OPTIONS = [
  {
    id: "restaurant",
    icon: "🍽️",
    key: "catalogOnboardingRestaurant",
    descKey: "catalogOnboardingRestaurantDesc",
    color: "#f59e0b",
    colorLight: "#fef3c7",
    glow: "rgba(245,158,11,0.25)",
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    badge: "Menú, platos, precios y fotos",
  },
  {
    id: "products",
    icon: "📦",
    key: "catalogOnboardingProducts",
    descKey: "catalogOnboardingProductsDesc",
    color: "#10b981",
    colorLight: "#d1fae5",
    glow: "rgba(16,185,129,0.25)",
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    badge: "Artículos, descripciones y precios",
  },
  {
    id: "services",
    icon: "🛠️",
    key: "catalogOnboardingServices",
    descKey: "catalogOnboardingServicesDesc",
    color: "#6366f1",
    colorLight: "#e0e7ff",
    glow: "rgba(99,102,241,0.25)",
    gradient: "from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    badge: "Lista de servicios profesionales",
  },
  {
    id: "blank",
    icon: "✨",
    key: "catalogOnboardingBlank",
    descKey: "catalogOnboardingBlankDesc",
    color: "#6b7280",
    colorLight: "#f3f4f6",
    glow: "rgba(107,114,128,0.15)",
    gradient: "from-neutral-50 to-stone-50",
    border: "border-neutral-200",
    badge: "Desde cero, sin contenido",
  },
];

export default function NewCatalogPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = getT(lang);
  const [creating, setCreating] = useState("");
  const [hovered, setHovered] = useState("");

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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "#f8f7f4" }}>
      {/* Top gradient banner */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-amber-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-100/30 via-transparent to-transparent pointer-events-none" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px), radial-gradient(circle, #f59e0b 1px, transparent 1px)",
        backgroundSize: "40px 40px, 60px 60px",
        backgroundPosition: "0 0, 20px 20px",
      }} />

      {/* Colorful floating orbs */}
      <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full opacity-[0.08] blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }} />
      <div className="absolute bottom-[15%] right-[8%] w-80 h-80 rounded-full opacity-[0.07] blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
      <div className="absolute top-[50%] left-[50%] w-64 h-64 rounded-full opacity-[0.05] blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", transform: "translate(-50%, -50%)" }} />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12">
        {creating ? (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-neutral-100 flex items-center justify-center">
                <span className="text-2xl animate-bounce">{OPTIONS.find(o => o.id === creating)?.icon || "✨"}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <p className="text-sm text-neutral-500 animate-pulse">Creating your catalog...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md border border-neutral-100 mb-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">{t.catalogOnboardingTitle}</h1>
              <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">{t.catalogOnboardingSubtitle}</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.map((opt) => {
                const isHovered = hovered === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => create(opt.id)}
                    onMouseEnter={() => setHovered(opt.id)}
                    onMouseLeave={() => setHovered("")}
                    className="group relative text-left p-5 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] overflow-hidden"
                    style={{
                      border: `1px solid ${isHovered ? opt.color + "40" : "#e5e7eb"}`,
                      boxShadow: isHovered ? `0 8px 32px ${opt.glow}` : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Top accent stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 transition-all duration-500"
                      style={{ height: isHovered ? "3px" : "0px", background: opt.color }}
                    />

                    {/* Background gradient on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
                    />

                    <div className="relative flex items-start gap-4">
                      {/* Icon circle */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 relative"
                        style={{
                          background: isHovered ? opt.color : opt.colorLight,
                          boxShadow: isHovered ? `0 4px 16px ${opt.glow}` : "0 1px 4px rgba(0,0,0,0.04)",
                          transform: isHovered ? "scale(1.08)" : "scale(1)",
                        }}
                      >
                        <span className="text-2xl transition-transform duration-300" style={{ transform: isHovered ? "scale(1.15)" : "scale(1)" }}>
                          {opt.icon}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-sm font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                          {(t as any)[opt.key]}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          {(t as any)[opt.descKey]}
                        </p>

                        {/* Badge chip */}
                        <span
                          className="inline-block mt-2.5 text-[10px] font-medium px-2.5 py-1 rounded-full transition-all duration-300"
                          style={{
                            background: isHovered ? opt.color + "18" : "#f3f4f6",
                            color: isHovered ? opt.color : "#9ca3af",
                          }}
                        >
                          {opt.badge}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div
                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 mt-1"
                        style={{
                          background: isHovered ? opt.color + "12" : "#f9fafb",
                        }}
                      >
                        <svg
                          className="w-4 h-4 transition-all duration-300"
                          style={{
                            color: isHovered ? opt.color : "#d1d5db",
                            transform: isHovered ? "translateX(2px)" : "translateX(0)",
                          }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom branding */}
            <p className="text-center text-[11px] text-neutral-400 mt-8">
              Los datos de ejemplo se pueden modificar o eliminar después
            </p>
          </>
        )}
      </div>
    </div>
  );
}