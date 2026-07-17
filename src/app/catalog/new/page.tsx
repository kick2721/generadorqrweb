"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getT } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";

const OPTIONS = [
  { id: "restaurant", icon: "🍽️", key: "catalogOnboardingRestaurant", descKey: "catalogOnboardingRestaurantDesc", count: "86 items" },
  { id: "products", icon: "📦", key: "catalogOnboardingProducts", descKey: "catalogOnboardingProductsDesc", count: "14 items" },
  { id: "services", icon: "🛠️", key: "catalogOnboardingServices", descKey: "catalogOnboardingServicesDesc", count: "12 items" },
  { id: "blank", icon: "📄", key: "catalogOnboardingBlank", descKey: "catalogOnboardingBlankDesc" },
];

export default function NewCatalogPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = getT(lang);
  const [creating, setCreating] = useState(false);

  const create = async (template: string) => {
    if (creating) return;
    setCreating(true);
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      {creating ? (
        <p className="text-neutral-500 animate-pulse">Creating catalog...</p>
      ) : (
        <div className="max-w-md w-full mx-auto p-8 space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-neutral-800">{t.catalogOnboardingTitle}</h2>
            <p className="text-sm text-neutral-500 mt-1">{t.catalogOnboardingSubtitle}</p>
          </div>
          <div className="space-y-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => create(opt.id)}
                className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-white transition-all active:scale-[0.98] group bg-white shadow-sm"
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
      )}
    </div>
  );
}