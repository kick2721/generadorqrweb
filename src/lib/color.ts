export function hexToRgb(hex: string) {
  const v = parseInt(hex.replace("#", ""), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map(c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a: string, b: string) {
  const L1 = luminance(a), L2 = luminance(b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
