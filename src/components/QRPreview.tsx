"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { useLang } from "@/context/LangContext";
import type { QRFormData } from "./QRForm";
import { buildQrOptions } from "@/lib/qr-options";
import { frameClass } from "@/lib/frames";

export default function QRPreview({ qrData, isLogoBlocked, withPro, withAuth, onDownload, isDownloadable }: { qrData: QRFormData | null | undefined; isLogoBlocked: boolean; withPro: (cb: () => void) => void; withAuth: (cb: () => void) => void; onDownload?: (format: string) => Promise<string | null | undefined>; isDownloadable?: boolean }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<any>(null);
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrData?.hasValues || !canvasRef.current) {
      if (qrRef.current && canvasRef.current) {
        canvasRef.current.innerHTML = "";
        qrRef.current = null;
      }
      return;
    }
    try {
      if (!qrRef.current) {
        qrRef.current = new QRCodeStyling(buildQrOptions(qrData));
        qrRef.current.append(canvasRef.current);
      } else {
        qrRef.current.update(buildQrOptions(qrData));
      }
    } catch {
      if (canvasRef.current) canvasRef.current.innerHTML = "";
      qrRef.current = null;
    }
  }, [qrData]);

  const downloadQR = async (format: string, qrInstance?: any) => {
    const qr = qrInstance || qrRef.current;
    if (!qr) return;
    if (format === "svg") {
      const blob = await qr.getRawData("svg");
      const a = document.createElement("a");
      a.download = `qrwing-${Date.now()}.svg`;
      a.href = URL.createObjectURL(blob);
      a.click();
    } else if (format === "jpg") {
      const pngBlob = await qr.getRawData("png");
      const img = new Image();
      const url = URL.createObjectURL(pngBlob);
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      URL.revokeObjectURL(url);
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.download = `qrwing-${Date.now()}.jpg`;
        a.href = URL.createObjectURL(b);
        a.click();
      }, "image/jpeg", 0.92);
    } else {
      qr.download({ name: `qrwing-${Date.now()}`, extension: "png" });
    }
  };

  const handleDownloadClick = async (format: string) => {
    if (isDownloadable === false) return;
    const newContent = await onDownload?.(format);
    const qrInstance = newContent ? new QRCodeStyling({ ...buildQrOptions(qrData!), data: newContent }) : undefined;
    downloadQR(format, qrInstance);
  };

  return (
    <>
      <div ref={canvasRef} className={`${frameClass(qrData?.config?.frame || "none")}`} style={{ minWidth: 256, minHeight: 256 }}>
        {!qrData?.hasValues && (
          <div className="flex items-center justify-center text-gray-400" style={{ width: 256, height: 256 }}>
            <p className="text-sm text-center px-4">{t("placeholderQr")}</p>
          </div>
        )}
      </div>
      {qrData?.hasValues && (
        <div className="flex flex-wrap gap-2 justify-center">
          {isDownloadable === false && (
            <p className="w-full text-xs text-gray-400 text-center mb-1">{t("downloadInvalid")}</p>
          )}
          <button disabled={isDownloadable === false} onClick={() => withPro(() => handleDownloadClick("png"))} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed">{t("downloadPng")}</button>
          <button disabled={isDownloadable === false} onClick={() => withPro(() => handleDownloadClick("jpg"))} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed">JPG</button>
          <button disabled={isDownloadable === false} onClick={() => withPro(() => handleDownloadClick("svg"))} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed">{t("downloadSvg")}</button>
          <button disabled={isDownloadable === false} onClick={() => withAuth(async () => { if (isDownloadable !== false) { const newContent = await onDownload?.("png"); const qr = newContent ? new QRCodeStyling({ ...buildQrOptions(qrData!), data: newContent }) : qrRef.current; if (!qr) return; try { const blob = await qr.getRawData("png"); await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { qr.download({ name: `qrwing-${Date.now()}`, extension: "png" }); } } })} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed">{copied ? t("copied") : t("copy")}</button>
        </div>
      )}
    </>
  );
}
