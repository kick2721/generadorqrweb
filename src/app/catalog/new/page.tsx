"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getT } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";
import { UtensilsCrossed, Package, Briefcase, File } from "lucide-react";

const OPTIONS = [
  { id: "restaurant", icon: <UtensilsCrossed size={28} />, key: "catalogOnboardingRestaurant", descKey: "catalogOnboardingRestaurantDesc", accent: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
  { id: "products", icon: <Package size={28} />, key: "catalogOnboardingProducts", descKey: "catalogOnboardingProductsDesc", accent: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
  { id: "services", icon: <Briefcase size={28} />, key: "catalogOnboardingServices", descKey: "catalogOnboardingServicesDesc", accent: "from-indigo-500 to-purple-600", bg: "bg-indigo-50" },
  { id: "blank", icon: <File size={28} />, key: "catalogOnboardingBlank", descKey: "catalogOnboardingBlankDesc", accent: "from-neutral-500 to-neutral-700", bg: "bg-neutral-100" },
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #f5f5f5 100%)" }}>
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />

      {/* Floating gradient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "linear-gradient(135deg, #f59e0b, #ec4899)" }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }} />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12">
        {creating ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "#d1d5db", borderTopColor: "#6b7280" }} />
            <p className="text-sm text-neutral-500 animate-pulse">Creating your catalog...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 mb-5">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6366f1" }}>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">{t.catalogOnboardingTitle}</h1>
              <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">{t.catalogOnboardingSubtitle}</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => create(opt.id)}
                  onMouseEnter={() => setHovered(opt.id)}
                  onMouseLeave={() => setHovered("")}
                  className="group relative text-left p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  {/* Hover accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${opt.accent} transition-opacity duration-300 ${hovered === opt.id ? "opacity-100" : "opacity-0"}`} />

                  <div className="flex items-start gap-4">
                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-xl ${opt.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {opt.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                        {(t as any)[opt.key]}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {(t as any)[opt.descKey]}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                      <svg className={`w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-all duration-300 ${hovered === opt.id ? "translate-x-0.5" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <p className="text-center text-[11px] text-neutral-400 mt-8">You can change or remove all content after creation.</p>
          </>
        )}
      </div>
    </div>
  );
}