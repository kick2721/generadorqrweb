"use client";
import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "288px" };
const madrid = { lat: 40.4168, lng: -3.7038 };
const libraries: ("places")[] = ["places"];

type QuotaStatus = "loading" | "unavailable" | "maps-only" | "ok";

export default function LocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [quota, setQuota] = useState<QuotaStatus>("loading");

  useEffect(() => {
    fetch("/api/geo/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) { setQuota("ok"); return; }
        const mapsAvail = (d.usage?.maps?.used ?? 0) < (d.usage?.maps?.threshold ?? 0);
        const autoAvail = (d.usage?.autocomplete?.used ?? 0) < (d.usage?.autocomplete?.threshold ?? 0);
        if (!mapsAvail) setQuota("unavailable");
        else if (!autoAvail) setQuota("maps-only");
        else setQuota("ok");
      })
      .catch(() => setQuota("ok"));
  }, []);

  if (quota === "loading") {
    return (
      <div className="w-full h-72 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-800">
        Cargando mapa...
      </div>
    );
  }

  if (quota === "unavailable") {
    return (
      <div className="w-full h-72 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center text-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-800 px-6">
        Este mes hemos alcanzado el límite de visualizaciones del mapa. Vuelve el próximo mes.
      </div>
    );
  }

  return <MapContent value={value} onChange={onChange} showAutocomplete={quota === "ok"} />;
}

function MapContent({
  value,
  onChange,
  showAutocomplete,
}: {
  value: string;
  onChange: (v: string) => void;
  showAutocomplete: boolean;
}) {
  const [ipCenter, setIpCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string)) ||
    "";

  useEffect(() => {
    fetch("/api/geo/ip")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.lat != null && d?.lon != null) setIpCenter({ lat: d.lat, lng: d.lon }); })
      .catch(() => {});
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const center = useMemo(() => {
    const m = value.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    return m
      ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
      : (ipCenter ?? madrid);
  }, [value, ipCenter]);

  useEffect(() => {
    mapRef.current?.panTo(center);
  }, [center]);

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

  useEffect(() => {
    if (!showAutocomplete || !isLoaded || !inputRef.current || autocompleteRef.current) return;
    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      { fields: ["geometry", "formatted_address"] }
    );
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
      }
    });
  }, [isLoaded, onChange, showAutocomplete]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const coordMatch = val.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        onChange(`${coordMatch[1]},${coordMatch[2]}`);
        return;
      }
      const manualCoord = val.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (manualCoord) {
        onChange(`${manualCoord[1]},${manualCoord[2]}`);
      }
    },
    [onChange]
  );

  const handleMyLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange(`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`);
          setIsLocating(false);
        },
        () => setIsLocating(false)
      );
    }
  }, [onChange]);

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
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={showAutocomplete ? "Buscar un lugar, pegar coordenadas o enlace de Maps…" : "Pegar coordenadas o enlace de Maps…"}
          onChange={handleInputChange}
          className="flex-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        <button
          onClick={handleMyLocation}
          className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl text-sm transition-colors shrink-0 whitespace-nowrap"
          title="Usar mi ubicación"
        >
          📍 Mi ubicación
        </button>
      </div>
      <div className="relative">
        {isLocating && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-xl z-10">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
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
          <Marker position={center} draggable onDragEnd={onMarkerDrag} />
        </GoogleMap>
      </div>
    </div>
  );
}
