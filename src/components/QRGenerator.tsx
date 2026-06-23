"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useLang } from "@/context/LangContext";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import QRForm, { QRFormData } from "./QRForm";
import { FREE_MAX_QR } from "@/lib/constants";

const STORAGE_KEY = "qrwing_last_qr";

export default function QRGenerator() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [qrData, setQrData] = useState<QRFormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setQrData(parsed);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  const withAuth = (action: () => void) => {
    if (session?.user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginPrompt(true);
    }
  };

  const handleSignIn = async (provider?: string) => {
    try {
      if (qrData) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(qrData));
    } catch {}
    await signIn(provider, { callbackUrl: window.location.href });
  };

  const saveQR = async (data: QRFormData) => {
    if (!session?.user) { handleSignIn(); return; }
    if (!data.hasValues) return;
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
              <button onClick={() => withAuth(() => downloadQR("png"))} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("downloadPng")}</button>
              <button onClick={() => withAuth(() => downloadQR("svg"))} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95]">{t("downloadSvg")}</button>
              <button onClick={() => withAuth(copyToClipboard)} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">{copied ? t("copied") : t("copy")}</button>
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

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("signInRequired")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("signInRequiredDesc")}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleSignIn("google")} className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button onClick={() => handleSignIn("github")} className="w-full px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
            <button onClick={() => setShowLoginPrompt(false)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
