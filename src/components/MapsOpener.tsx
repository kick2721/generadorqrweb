"use client";
import { useEffect } from "react";

export default function MapsOpener({ query, qrId }: { query: string; qrId: string }) {
  const isCoord = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(query);

  useEffect(() => {
    const key = `scan_${qrId}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId }),
      }).catch(() => {});
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isCoord) {
      const [lat, lng] = query.split(",").map((s) => s.trim());
      if (isIOS) {
        window.location.href = `https://maps.apple.com/?ll=${lat},${lng}&q=${lat},${lng}`;
      } else if (isAndroid) {
        window.location.href = `https://maps.google.com/maps?q=${lat},${lng}`;
      }
    } else {
      const encoded = encodeURIComponent(query);
      if (isIOS) {
        window.location.href = `https://maps.apple.com/?q=${encoded}`;
      } else if (isAndroid) {
        window.location.href = `https://maps.google.com/maps?q=${encoded}`;
      }
    }
  }, [query, qrId, isCoord]);

  const googleMapsUrl = isCoord
    ? `https://maps.google.com/maps?q=${query.split(",").map((s) => s.trim()).join(",")}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}`;
  const appleMapsUrl = isCoord
    ? `https://maps.apple.com/?ll=${query.split(",").map((s) => s.trim()).join(",")}&q=${query.split(",").map((s) => s.trim()).join(",")}`
    : `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
  const wazeUrl = isCoord
    ? `https://waze.com/ul?ll=${query.split(",").map((s) => s.trim()).join(",")}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(query)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4">QRWing</p>
        <p className="text-sm font-semibold text-purple-600 mb-2">Ubicación</p>
        <p className="text-lg font-bold mb-4 break-words">{query}</p>
        <p className="text-sm text-gray-400 mb-4">Abriendo mapa...</p>
        <div className="flex flex-col gap-2">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            📍 Google Maps
          </a>
          <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            🗺️ Apple Maps
          </a>
          <a href={wazeUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
            🚗 Waze
          </a>
        </div>
      </div>
    </div>
  );
}
