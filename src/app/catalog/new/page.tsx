"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCatalogPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks: [], template: "blank", fonts: [] }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.qrId) router.replace(`/catalog/${data.qrId}/edit`);
        else router.replace("/dashboard?error=catalog-create-failed");
      })
      .catch(() => router.replace("/dashboard?error=catalog-create-failed"));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Creando catálogo...</p>
    </div>
  );
}
