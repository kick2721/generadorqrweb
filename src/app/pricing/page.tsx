"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const { t } = useLang();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleProCheckout() {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al crear el checkout");
        setLoading(false);
      }
    } catch {
      alert("Error de conexión");
      setLoading(false);
    }
  }

  const plans = [
    {
      name: t("planFree"),
      price: t("priceFree"),
      period: "",
      desc: t("planFreeDesc"),
      features: [t("featFree1"), t("featFree2"), t("featFree3"), t("featFree4")],
      cta: t("ctaFree"),
      featured: false,
      action: undefined,
    },
    {
      name: t("planPro"),
      price: t("pricePro"),
      period: t("perMonth"),
      desc: t("planProDesc"),
      features: [t("featPro1"), t("featPro2"), t("featPro3"), t("featPro4"), t("featPro5"), t("featPro6")],
      cta: t("ctaPro"),
      featured: true,
      action: handleProCheckout,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t("pricingTitle")}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          {t("pricingDesc")}
        </p>
      </section>

      <section className="mb-12 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("featPro3")}</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">{t("featPro6")}</p>

        <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg text-left">
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-purple-600">248</p>
            <p className="text-xs text-gray-400">{t("dashboardTotalScans")}</p>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-4">
            <div className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 text-center">
              <span className="block leading-tight">📈<br/>{t("analyticsTimeline")}</span>
            </div>
            <div className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 text-center">
              <span className="block leading-tight">🌍<br/>{t("analyticsCountries")}</span>
            </div>
            <div className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 text-center">
              <span className="block leading-tight">📱<br/>{t("analyticsDevices")}</span>
            </div>
            <div className="px-3 py-2 text-xs font-medium rounded-lg border border-purple-600 bg-purple-600 text-white text-center shadow-sm">
              <span className="block leading-tight">⏰<br/>{t("analyticsActivity")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-sm font-bold text-purple-600">2:00 PM</p>
              <p className="text-[10px] text-gray-400">{t("analyticsPeakHour")}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-sm font-bold text-purple-600">8.3</p>
              <p className="text-[10px] text-gray-400">{t("analyticsAvgDaily")}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-sm font-bold text-purple-600 truncate">Mon 26 Jun</p>
              <p className="text-[10px] text-gray-400">{t("analyticsBestDay")}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-sm font-bold text-purple-600">2h ago</p>
              <p className="text-[10px] text-gray-400">{t("analyticsLastScan")}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">{t("analyticsHourDistribution")}</p>
            <div className="space-y-1">
              {[
                { h: "2:00 PM", pct: 100, c: 12 },
                { h: "3:00 PM", pct: 67, c: 8 },
                { h: "1:00 PM", pct: 42, c: 5 },
                { h: "11:00 AM", pct: 33, c: 4 },
                { h: "4:00 PM", pct: 25, c: 3 },
              ].map(({ h, pct, c }) => (
                <div key={h} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-16 text-right text-xs">{h}</span>
                  <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-purple-500 rounded" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-400 text-xs w-6 text-right">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 border flex flex-col ${
              plan.featured
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-gray-500 text-sm">{plan.period}</span>
              )}
              {plan.featured && (
                <p className="text-xs text-gray-400 mt-1">{t("pricingQarNote")}</p>
              )}
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={plan.action}
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-medium transition duration-75 active:scale-[0.97] disabled:opacity-50 ${
                plan.featured
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              {plan.featured && loading ? t("loading") : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
