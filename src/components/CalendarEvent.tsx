"use client";

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

function formatIcs(raw: string): string {
  return raw.replace(/\n/g, "\r\n");
}

export default function CalendarEvent({ vcalRaw }: { vcalRaw: string }) {
  const { t } = useLang();
  const ev = parseVCalendar(vcalRaw);

  const handleAddToCalendar = async () => {
    const ics = formatIcs(vcalRaw);
    try {
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const file = new File([blob], "event.ics", { type: "text/calendar" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: ev.title || "Event", files: [file] });
        return;
      }
    } catch {}
    const dt = vcalRaw.match(/DTSTART:(\d{8})T?(\d{0,6})/);
    const dtNum = dt ? dt[1] + (dt[2] ? `T${dt[2]}00` : "T120000") : "";
    const endDate = dtNum ? dtNum.replace(/(\d{8})T(\d{6})/, (_, d, t) => {
      const start = new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T${t.slice(0,2)}:${t.slice(2,4)}:${t.slice(4,6)}`);
      start.setHours(start.getHours() + 1);
      return `${start.getFullYear()}${String(start.getMonth()+1).padStart(2,"0")}${String(start.getDate()).padStart(2,"0")}T${String(start.getHours()).padStart(2,"0")}${String(start.getMinutes()).padStart(2,"0")}00`;
    }) : "";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.title || "Event",
      dates: `${dtNum}/${endDate}`,
      location: ev.location || "",
      details: ev.description || "",
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
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
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
          {t("scannerAddToCalendar")}
        </button>
      </div>
    </div>
  );
}
