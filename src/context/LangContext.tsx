"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { LANGUAGES, getT, type Lang, type TranslationKey } from "@/lib/i18n";

type TFunc = (key: TranslationKey) => string;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunc;
}>({
  lang: "es",
  setLang: () => {},
  t: (() => "") as TFunc,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [synced, setSynced] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const saved = localStorage.getItem("qrwing-lang") as Lang | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
      document.cookie = `qrwing-lang=${saved};path=/;max-age=31536000;SameSite=Lax`;
    } else {
      const match = document.cookie.match(/(?:^|;\s*)qrwing-lang=([^;]*)/);
      if (match) {
        const cookieLang = match[1] as Lang;
        if (LANGUAGES.some((l) => l.code === cookieLang)) {
          setLangState(cookieLang);
          localStorage.setItem("qrwing-lang", cookieLang);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id && lang && !synced) {
      setSynced(true);
    }
  }, [session, lang, synced]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("qrwing-lang", l);
    document.cookie = `qrwing-lang=${l};path=/;max-age=31536000;SameSite=Lax`;
    fetch("/api/user/lang", { method: "PATCH", body: JSON.stringify({ lang }) }).catch(() => {});
  }, []);

  const t: TFunc = (key: TranslationKey) => getT(lang)[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
