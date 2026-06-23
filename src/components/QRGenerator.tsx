"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useLang } from "@/context/LangContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import QRForm, { QRFormData } from "./QRForm";
import { FREE_MAX_QR } from "@/lib/constants";

export default function QRGenerator() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [qrData, setQrData] = useState<QRFormData | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const saveQR = async (data: QRFormData) => {
    if (!session?.user || !data.hasValues) return;
    setSaving(true);
    setSaveError("");
    try {
      const r = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          content: data.content,
          redirect_to: data.redirect_to,
          label: data.label,
          config: data.config,
        }),
      });
      if (r.status === 402) { setSaveError("limit"); return; }
      if (!r.ok) { setSaveError("error"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("error");
    } finally {
      setSaving(false);
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (format === "png") {
      const canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      const svg = document.querySelector("#qr-svg-download svg") as SVGSVGElement;
      if (!svg) return;
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const blob = new Blob([clone.outerHTML], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { downloadQR("png"); }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <QRForm onChange={setQrData} onSubmit={saveQR} submitLabel={t("save")} saving={saving} />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div ref={canvasRef} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {qrData?.hasValues ? (
              <>
                <QRCodeCanvas value={qrData.content} size={qrData.config.size} fgColor={qrData.config.fgColor} bgColor={qrData.config.bgColor} level="H" includeMargin
                  imageSettings={qrData.config.logo ? { src: qrData.config.logo, height: qrData.config.size * 0.25, width: qrData.config.size * 0.25, excavate: true } : undefined} />
                <div id="qr-svg-download" style={{ display: "none" }}>
                  <QRCodeSVG value={qrData.content} size={qrData.config.size} fgColor={qrData.config.fgColor} bgColor={qrData.config.bgColor} level="H" includeMargin
                    imageSettings={qrData.config.logo ? { src: qrData.config.logo, height: qrData.config.size * 0.25, width: qrData.config.size * 0.25, excavate: true } : undefined} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center text-gray-400" style={{ width: 256, height: 256 }}>
                <p className="text-sm text-center px-4">{t("placeholderQr")}</p>
              </div>
            )}
          </div>

          {qrData?.hasValues && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => downloadQR("png")} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("downloadPng")}</button>
              <button onClick={() => downloadQR("svg")} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95]">{t("downloadSvg")}</button>
              <button onClick={copyToClipboard} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">{copied ? t("copied") : t("copy")}</button>
              {saveError === "limit" && (
                <div className="w-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">{t("saveLimitTitle")} <strong>{FREE_MAX_QR} {t("saveLimitQr")}</strong></p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t("saveLimitDesc")}</p>
                  <a href="/pricing" className="inline-block mt-3 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors active:scale-[0.95]">{t("upgradeToPro")} →</a>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center max-w-xs">{t("staticFree")}</p>
        </div>
      </div>
    </div>
  );
}
