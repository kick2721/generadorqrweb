"use client";

import { useTheme } from "./ThemeProvider";

const QR_ROWS = [
  "1111111011010100001111111",
  "1000001010010010101000001",
  "1011101011010101001011101",
  "1011101001000100101011101",
  "1011101011000010101011101",
  "1000001000101100101000001",
  "1111111010101010101111111",
  "0000000001011101100000000",
  "1001111110110011010010111",
  "0010010100000011010111110",
  "1100001000110001011111001",
  "1000010011011011010001111",
  "1001111010111000101000001",
  "1110000010001011010010010",
  "1100111110000111011011111",
  "1001110011010011010101101",
  "1010011110001111111110110",
  "0000000010001100100010110",
  "1111111010111000101010001",
  "1000001010101111100010000",
  "1011101010000011111110000",
  "1011101011110010011000011",
  "1011101000111010110011111",
  "1000001001011010010110111",
  "1111111011010000101001001",
];

export default function Logo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const wordColor = isDark ? "#f9fafb" : "#020617";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <svg viewBox="0 0 240 64" role="img" aria-labelledby="title desc" className="h-12 w-auto">
      <title id="title">QRWing</title>
      <desc id="desc">A scannable QR code for https://generadorqrweb.vercel.app/ beside the QRWing wordmark.</desc>
      <defs>
        <linearGradient id="qrwingAccent" x1="82" y1="12" x2="216" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4c1d95"/>
          <stop offset="0.55" stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="12" fill="#ffffff"/>
      <rect x="4.5" y="4.5" width="55" height="55" rx="11.5" fill="none" stroke={borderColor}/>
      <g fill="#111827" transform="translate(12 12) scale(1.6)" shapeRendering="crispEdges">
        {QR_ROWS.map((row, y) =>
          [...row].map((cell, x) =>
            cell === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null
          )
        )}
      </g>

      <g fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        <text x="76" y="42" fill="url(#qrwingAccent)" fontSize="38" fontWeight="820">QR</text>
        <text x="130" y="42" fill={wordColor} fontSize="38" fontWeight="950" paintOrder="stroke" stroke={isDark ? "#111827" : "#ffffff"} strokeWidth="0.65">Wing</text>
      </g>
      <path d="M131 51h66" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" opacity="0.24"/>
    </svg>
  );
}
