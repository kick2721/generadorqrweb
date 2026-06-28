"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import QRCodeStyling from "qr-code-styling";

interface Row {
  type: string;
  content: string;
  label: string;
}

export default function BulkQR() {
  const [rows, setRows] = useState<Row[]>([]);
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const typeIdx = header.indexOf("type");
    const contentIdx = header.indexOf("content");
    const labelIdx = header.indexOf("label");
    if (typeIdx === -1 || contentIdx === -1) return;
    const parsed: Row[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      if (!vals[contentIdx]) continue;
      parsed.push({
        type: vals[typeIdx] || "url",
        content: decodeURIComponent(vals[contentIdx]),
        label: labelIdx >= 0 ? vals[labelIdx] || `qr-${i}` : `qr-${i}`,
      });
    }
    setRows(parsed);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (e) => parseCSV((e.target?.result as string) || "");
    reader.readAsText(file);
  };

  const generateZIP = async () => {
    if (rows.length === 0) return;
    setGenerating(true);
    const zip = new JSZip();
    const folder = zip.folder("qrcodes");
    if (!folder) { setGenerating(false); return; }
    for (const row of rows) {
      const safeName = row.label.replace(/[^a-zA-Z0-9_-]/g, "_");
      try {
        const qr = new QRCodeStyling({
          width: 512,
          height: 512,
          data: row.content,
          dotsOptions: { type: "square", color: "#000000" },
          cornersSquareOptions: { type: "square", color: "#000000" },
          cornersDotOptions: { type: "square", color: "#000000" },
          backgroundOptions: { color: "#ffffff" },
          qrOptions: { errorCorrectionLevel: "M" },
        });
        const blob = await qr.getRawData("svg") as Blob | null;
        if (blob) folder.file(`${safeName}.svg`, blob);
      } catch {}
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `qrcodes-bulk-${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    setGenerating(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Generación Masiva de QR</h1>
      <p className="text-gray-500 mb-8">
        Sube un archivo CSV con las columnas <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">type</code>,{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">content</code>,{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">label</code>{" "}
        y descarga un ZIP con todos los códigos QR en SVG.
      </p>

      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          dragOver ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" : "border-gray-300 dark:border-gray-700 hover:border-purple-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
      >
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="font-medium mb-1">{rows.length > 0 ? `${rows.length} filas cargadas` : "Arrastra tu CSV aquí o haz clic para seleccionar"}</p>
        <p className="text-sm text-gray-400">Formato: type,content,label</p>
        <input ref={fileRef} type="file" accept=".csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
      </div>

      {rows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{rows.length} códigos QR ({rows.filter(r => r.type === "url").length} URL, {rows.filter(r => r.type === "wifi").length} WiFi, {rows.filter(r => r.type === "vcard").length} vCard, {rows.filter(r => !["url","wifi","vcard"].includes(r.type)).length} otros)</h2>
            <button
              onClick={generateZIP}
              disabled={generating}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 active:scale-[0.97]"
            >
              {generating ? "Generando..." : "Descargar ZIP"}
            </button>
          </div>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Contenido</th>
                  <th className="text-left px-4 py-3 font-medium">Etiqueta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">{r.type}</span>
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate text-gray-500 font-mono text-xs">{r.content}</td>
                    <td className="px-4 py-2 font-mono text-xs">{r.label}</td>
                  </tr>
                ))}
                {rows.length > 50 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400 text-sm">... y {rows.length - 50} filas más</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
