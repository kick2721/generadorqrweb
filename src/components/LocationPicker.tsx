"use client";
import { useEffect, useRef } from "react";

export default function LocationPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapRef.current) return;
    initialized.current = true;

    let lat = 40.4168;
    let lng = -3.7038;

    const coordMatch = value.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[2]);
    }

    const loadMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(`${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`);
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(`${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)}`);
      });

      mapInstance.current = map;
      markerRef.current = marker;
    };

    loadMap().catch(() => {});

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        initialized.current = false;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-72 rounded-xl border border-gray-300 dark:border-gray-700 z-0" />;
}
