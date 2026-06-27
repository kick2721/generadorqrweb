"use client";

import BackToHome from "@/components/BackToHome";
import { useLang } from "@/context/LangContext";

export default function TosPage() {
  const { t } = useLang();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('tosTitle')}</h1>
      <p className="text-sm text-gray-500 mb-2">{t('tosUpdated')}</p>
      <p className="text-sm text-gray-500 mb-8">
        {t('tosIntro1')} QRWing {t('tosIntro2')}
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec1Title')}</h2>
          <p>QRWing{t('tosSec1Content')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec2Title')}</h2>
          <p>{t('tosSec2Content')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec3Title')}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('tosSec3Item1')}</li>
            <li>{t('tosSec3Item2')}</li>
            <li>{t('tosSec3Item3')}</li>
            <li>{t('tosSec3Item4')}</li>
            <li>{t('tosSec3Item5')}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec4Title')}</h2>
          <p>{t('tosSec4Intro1')} QRWing {t('tosSec4Intro2')}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('tosSec4Item1')}</li>
            <li>{t('tosSec4Item2')}</li>
            <li>{t('tosSec4Item3')}</li>
            <li>{t('tosSec4Item4')}</li>
            <li>{t('tosSec4Item5')}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec5Title')}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('tosSec5Item1')}</li>
            <li>{t('tosSec5Item2')}</li>
            <li>{t('tosSec5Item3')}</li>
            <li>{t('tosSec5Item4')}</li>
            <li>{t('tosSec5Item5')}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec6Title')}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('tosSec6Item1a')} QRWing {t('tosSec6Item1b')}</li>
            <li>{t('tosSec6Item2a')} QRWing {t('tosSec6Item2b')}</li>
            <li>{t('tosSec6Item3')}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec7Title')}</h2>
          <p>QRWing{t('tosSec7Desc1')}</p>
          <p className="mt-2">{t('tosSec7Desc2a')} QRWing {t('tosSec7Desc2b')}</p>
          <p className="mt-2">{t('tosSec7Desc3')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec8Title')}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t('tosSec8Item1')}</li>
            <li>{t('tosSec8Item2')}</li>
            <li>{t('tosSec8Item3')}</li>
            <li>{t('tosSec8Item4')}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec9Title')}</h2>
          <p>{t('tosSec9Content')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec10Title')}</h2>
          <p>{t('tosSec10Desc1')}</p>
          <p className="mt-2">{t('tosSec10Desc2')}</p>
          <p className="mt-2">{t('tosSec10Desc3')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('tosSec11Title')}</h2>
          <p>{t('tosSec11Intro')}</p>
          <p className="mt-2">
            {t('tosSec11EmailLabel')} <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
