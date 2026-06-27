"use client";

import { useLang } from "@/context/LangContext";
import BackToHome from "@/components/BackToHome";

export default function ImprintPage() {
  const { t } = useLang();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("imprintTitle")}</h1>
      <p className="text-sm text-gray-500 mb-8">{t("imprintUpdated")}</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("imprintSec1Title")}</h2>
          <p>{t("imprintSec1Desc")}</p>
          <ul className="list-none mt-2 space-y-1">
            <li><strong>{t("imprintName")}</strong> GeneradorQR</li>
            <li><strong>{t("imprintContact")}</strong> <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a></li>
            <li><strong>{t("imprintJurisdiction")}</strong> {t("imprintJurisdictionValue")}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("imprintSec2Title")}</h2>
          <p>{t("imprintSec2Desc")}</p>
          <p className="mt-2">
            Email: <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("imprintSec3Title")}</h2>
          <p>{t("imprintSec3Content")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("imprintSec4Title")}</h2>
          <p>{t("imprintSec4Content")}</p>
        </div>
      </section>
    </main>
  );
}
