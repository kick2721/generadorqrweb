"use client";

import { useMemo } from "react";
import { useLang } from "@/context/LangContext";

function parseVCalendar(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  const dtstart = get("DTSTART");
  const dateStr = dtstart ? dtstart.replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_, y, m, d, h, min) => {
    return `${y}-${m}-${d}${h ? ` ${h}:${min || "00"}` : ""}`;
  }) : "";
  return { title: get("SUMMARY"), date: dateStr, location: get("LOCATION"), description: get("DESCRIPTION") };
}

function toBase64url(s: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(s).toString("base64url");
}

export default function CalendarEvent({ vcalRaw }: { vcalRaw: string }) {
  const { t } = useLang();
  const ev = useMemo(() => parseVCalendar(vcalRaw), [vcalRaw]);

  const handleAddToCalendar = async () => {
    const ics = vcalRaw.replace(/\n/g, "\r\n");
    const enc = toBase64url(ics);
    const url = `/api/calendar/export?d=${enc}`;
    try {
      await navigator.share({ title: ev.title || "Evento", url });
    } catch {
      window.location.href = url;
    }
  };

  const isCoord = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(ev.location);
  const geoUri = isCoord ? `geo:${ev.location}` : `geo:0,0?q=${encodeURIComponent(ev.location)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">{t("scannerEventTitle")}</p>
        <p className="text-xl font-bold mb-1">{ev.title || t("scannerEventTitle")}</p>
        {ev.date && <p className="text-gray-500 text-sm">📅 {ev.date}</p>}
        {ev.location && (
          <p className="text-gray-500 text-sm">
            📍{" "}
            <a href={geoUri} className="hover:underline">
              {ev.location}
            </a>
          </p>
        )}
        {ev.description && <p className="text-gray-400 text-xs mt-2">{ev.description}</p>}
        <button onClick={handleAddToCalendar}
          className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
          {t("scannerAddToCalendar")}
        </button>
      </div>
    </div>
  );
}
