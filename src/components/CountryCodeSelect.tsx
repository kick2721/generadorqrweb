"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { COUNTRY_CODES } from "@/data/country-codes";
import { useLang } from "@/context/LangContext";

const USERNAME_LABEL = "@ Username";
const USERNAME_OPTION = { code: "__username__", label: USERNAME_LABEL, flag: "✏️", dial: "@" };

interface Props {
  value: string;
  onChange: (code: string) => void;
  includeUsername?: boolean;
}

export default function CountryCodeSelect({ value, onChange, includeUsername }: Props) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [detected, setDetected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayNames = useMemo(() => {
    try { return new Intl.DisplayNames(lang, { type: "region" }); } catch { return null; }
  }, [lang]);

  function countryName(code: string): string {
    return displayNames?.of(code) ?? code;
  }

  const options = includeUsername ? [USERNAME_OPTION, ...COUNTRY_CODES] : COUNTRY_CODES;

  const selected = value === "__username__"
    ? USERNAME_OPTION
    : COUNTRY_CODES.find(c => c.code === value);

  useEffect(() => {
    if (detected || value) return;
    setDetected(true);
    fetch("/api/geo/country")
      .then(r => r.json())
      .then(data => {
        if (data.countryCode && COUNTRY_CODES.some(c => c.code === data.countryCode)) {
          onChange(data.countryCode);
        }
      })
      .catch(() => {});
  }, [detected, value, onChange]);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter(c => {
    if (c.code === USERNAME_OPTION.code) {
      return USERNAME_LABEL.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search);
    }
    const localized = countryName(c.code);
    return localized.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase());
  });

  const select = useCallback((code: string) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  }, [onChange]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium whitespace-nowrap cursor-pointer hover:border-purple-400 transition-colors min-w-[110px]"
      >
        {selected ? (
          <><span className="text-base leading-none">{selected.flag}</span><span>{selected.dial}</span></>
        ) : (
          <span className="text-gray-400">{includeUsername ? "@" : "+00"}</span>
        )}
        <svg className={`w-3.5 h-3.5 ml-0.5 transition-transform text-gray-400 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[280px] max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
            <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={includeUsername ? "Search country or @..." : "Search country..."}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:border-purple-500"
            />
          </div>
          <div className="py-1">
            {filtered.map(c => (
              <button key={c.code} type="button" onClick={() => select(c.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                  c.code === value
                    ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                } ${c.code === USERNAME_OPTION.code ? "border-t border-gray-200 dark:border-gray-700 mt-1 pt-3" : ""}`}
              >
                <span className="text-base w-6 text-center">{c.flag}</span>
                <span className="flex-1 truncate">
                  {c.code === USERNAME_OPTION.code ? USERNAME_LABEL : countryName(c.code)}
                </span>
                <span className="text-gray-400 text-xs font-mono">{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
