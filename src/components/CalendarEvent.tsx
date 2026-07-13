"use client";

import { useMemo, useCallback } from "react";
import { useLang } from "@/context/LangContext";

function getField(text: string, k: string): string {
  const m = text.match(new RegExp(`${k}:(.+)`, "m"));
  return m ? m[1].trim() : "";
}

function parseVCalendar(text: string) {
  const dtstart = getField(text, "DTSTART");
  const dtend = getField(text, "DTEND");
  const displayDate = dtstart ? dtstart.replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_, y, m, d, h, min) => {
    return `${y}-${m}-${d}${h ? ` ${h}:${min || "00"}` : ""}`;
  }) : "";
  return {
    title: getField(text, "SUMMARY"),
    displayDate,
    location: getField(text, "LOCATION"),
    description: getField(text, "DESCRIPTION"),
    dtstart,
    dtend,
  };
}

function isTimed(raw: string): boolean {
  return raw.includes("T");
}

function addHour(raw: string): string {
  if (!isTimed(raw)) return raw;
  const year = +raw.slice(0, 4);
  const month = +raw.slice(4, 6) - 1;
  const day = +raw.slice(6, 8);
  const hour = +raw.slice(9, 11);
  const min = +raw.slice(11, 13);
  const d = new Date(year, month, day, hour + 1, min);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}${mo}${dd}T${hh}${mm}00`;
}

function addDay(raw: string): string {
  const year = +raw.slice(0, 4);
  const month = +raw.slice(4, 6) - 1;
  const day = +raw.slice(6, 8);
  const d = new Date(year, month, day + 1);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarEvent({ vcalRaw, qrId }: { vcalRaw: string; qrId?: string }) {
  const { t } = useLang();
  const ev = useMemo(() => parseVCalendar(vcalRaw), [vcalRaw]);

  const trackScan = useCallback(() => {
    if (!qrId) return;
    const key = `scan_${qrId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrId }),
    }).catch(() => {});
  }, [qrId]);

  const googleUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (ev.title) p.set("text", ev.title);
    if (ev.dtstart) {
      if (isTimed(ev.dtstart)) {
        const end = ev.dtend || addHour(ev.dtstart);
        p.set("dates", `${ev.dtstart}/${end}`);
      } else {
        const end = ev.dtend ? ev.dtend.slice(0, 8) : addDay(ev.dtstart.slice(0, 8));
        p.set("dates", `${ev.dtstart.slice(0, 8)}/${end}`);
      }
    }
    if (ev.description) p.set("details", ev.description);
    if (ev.location) p.set("location", ev.location);
    p.set("sf", "true");
    p.set("output", "popup");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${p.toString()}`;
  }, [ev]);

  const handleGoogle = () => {
    trackScan();
    window.location.href = googleUrl;
  };

  const handleApple = () => {
    trackScan();
    const ics = vcalRaw.replace(/\n/g, "\r\n");
    window.location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  };

  const isCoord = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(ev.location);
  const geoUri = isCoord ? `geo:${ev.location}` : `geo:0,0?q=${encodeURIComponent(ev.location)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">{t("scannerEventTitle")}</p>
        <p className="text-xl font-bold mb-1">{ev.title || t("scannerEventTitle")}</p>
        {ev.displayDate && <p className="text-gray-500 text-sm">📅 {ev.displayDate}</p>}
        {ev.location && (
          <p className="text-gray-500 text-sm">
            📍{" "}
            <a href={geoUri} className="hover:underline">
              {ev.location}
            </a>
          </p>
        )}
        {ev.description && <p className="text-gray-400 text-xs mt-2">{ev.description}</p>}
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={handleGoogle}
            className="w-full px-6 py-3 bg-white border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google Calendar
          </button>
          <button onClick={handleApple}
            className="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.62-.71 1.64-1.16 2.57-1.13.09.96-.31 1.96-.95 2.67-.62.71-1.58 1.17-2.55 1.1-.09-1.01.27-2 .93-2.64z"/></svg>
            Apple Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
