"use client";
import { useMemo, useRef, useCallback, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "288px" };
const defaultCenter = { lat: 40.4168, lng: -3.7038 };

export default function LocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string)) ||
    "";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const center = useMemo(() => {
    const m = value.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    return m
      ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
      : defaultCenter;
  }, [value]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat != null && lng != null) {
        onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
      }
    },
    [onChange]
  );

  const onMarkerDrag = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat != null && lng != null) {
        onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
      }
    },
    [onChange]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (val.length < 3) return;
      debounceRef.current = setTimeout(async () => {
        setGeocoding(true);
        try {
          const res = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: val }),
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data.lat != null && data.lng != null) {
            onChange(`${data.lat.toFixed(6)},${data.lng.toFixed(6)}`);
          }
        } catch {
        } finally {
          setGeocoding(false);
        }
      }, 600);
    },
    [onChange]
  );

  if (loadError) {
    return (
      <div className="w-full h-72 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-800">
        Google Maps no disponible — verifica la API key
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-72 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-800">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar lugar en el mapa…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        {geocoding && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            buscando…
          </span>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={center}
          draggable
          onDragEnd={onMarkerDrag}
        />
      </GoogleMap>
    </div>
  );
}
