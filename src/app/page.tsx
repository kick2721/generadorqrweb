"use client";

import QRGenerator from "@/components/QRGenerator";
import { useLang } from "@/context/LangContext";

export default function Home() {
  const { t } = useLang();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {t("heroTitle")}
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("heroSubtitle")}
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {t("heroDesc")}
        </p>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-10 mb-16">
        <QRGenerator />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t("vsTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("planFree")}</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">{t("feat1Title")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featFree1")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featFree2")}
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row rounded-2xl border border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/30 shadow-lg overflow-hidden">
            <div className="p-6 flex-1">
              <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full font-medium">{t("planPro")}</span>
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{t("pricePro")}{t("perMonth")}</span>
              <h3 className="font-semibold text-lg mt-1 mb-3">{t("vsProTitle")}</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("featPro2")}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("featPro3")}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("featPro4")}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("vsProDashboard")}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("featPro5")}
                </li>
              </ul>
            </div>
            <div className="w-px bg-purple-200 dark:bg-purple-800" />
            <div className="p-5 flex-1 bg-white dark:bg-gray-900 flex flex-col justify-center">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">{t("analyticsActivity")}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm font-bold text-purple-600">248</p>
                  <p className="text-[10px] text-gray-400">{t("dashboardTotalScans")}</p>
                </div>
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
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">{t("featPro6")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
