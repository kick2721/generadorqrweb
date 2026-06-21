"use client";

import { useEffect } from "react";

export default function MailRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") || "";
    const subject = params.get("subject") || "";
    const body = params.get("body") || "";
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-500">Opening email app...</p>
    </div>
  );
}
