export interface Theme {
  id: string;
  label: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  text: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentText: string;
  radius: string;
  tagBg: string;
  sectionBorder: string;
  divider: string;
  font: string;
}

export const themes: Record<string, Theme> = {
  claro: {
    id: "claro",
    label: "Claro",
    bg: "#f8f9fa",
    cardBg: "#ffffff",
    cardBorder: "1px solid #f1f3f5",
    cardShadow: "0 1px 3px rgba(0,0,0,0.06)",
    text: "#1f2937",
    textMuted: "#6b7280",
    accent: "#7c3aed",
    accentLight: "#f5f3ff",
    accentText: "#ffffff",
    radius: "12px",
    tagBg: "#f5f3ff",
    sectionBorder: "#e5e7eb",
    divider: "#e5e7eb",
    font: "Inter",
  },
  oscuro: {
    id: "oscuro",
    label: "Oscuro",
    bg: "#0f1117",
    cardBg: "#1a1d27",
    cardBorder: "1px solid #2a2d3a",
    cardShadow: "0 1px 3px rgba(0,0,0,0.3)",
    text: "#f1f3f5",
    textMuted: "#9ca3af",
    accent: "#f59e0b",
    accentLight: "#2a2020",
    accentText: "#1f2937",
    radius: "12px",
    tagBg: "#2a2020",
    sectionBorder: "#2a2d3a",
    divider: "#2a2d3a",
    font: "Inter",
  },
  natural: {
    id: "natural",
    label: "Natural",
    bg: "#f5f0eb",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e8e0d6",
    cardShadow: "0 2px 8px rgba(0,0,0,0.04)",
    text: "#3a3a2e",
    textMuted: "#8a7f72",
    accent: "#5b8c5a",
    accentLight: "#f0f5ef",
    accentText: "#ffffff",
    radius: "8px",
    tagBg: "#f0f5ef",
    sectionBorder: "#e8e0d6",
    divider: "#e8e0d6",
    font: "Lato",
  },
  elegante: {
    id: "elegante",
    label: "Elegante",
    bg: "#f7f5f0",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e5ddd0",
    cardShadow: "0 4px 16px rgba(0,0,0,0.03)",
    text: "#2d2416",
    textMuted: "#8a7a64",
    accent: "#b8860b",
    accentLight: "#faf6ee",
    accentText: "#ffffff",
    radius: "4px",
    tagBg: "#faf6ee",
    sectionBorder: "#e5ddd0",
    divider: "#e5ddd0",
    font: "Playfair Display",
  },
  vibrante: {
    id: "vibrante",
    label: "Vibrante",
    bg: "linear-gradient(135deg, #0f0a2e 0%, #1a0a3e 50%, #2a0a4e 100%)",
    cardBg: "rgba(255,255,255,0.08)",
    cardBorder: "1px solid rgba(255,255,255,0.12)",
    cardShadow: "0 4px 20px rgba(0,0,0,0.3)",
    text: "#f1f1ff",
    textMuted: "#a8a0c0",
    accent: "#e940a0",
    accentLight: "rgba(233,64,160,0.15)",
    accentText: "#ffffff",
    radius: "16px",
    tagBg: "rgba(233,64,160,0.12)",
    sectionBorder: "rgba(255,255,255,0.1)",
    divider: "rgba(255,255,255,0.08)",
    font: "Space Grotesk",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    bg: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e5e5e5",
    cardShadow: "none",
    text: "#171717",
    textMuted: "#a3a3a3",
    accent: "#404040",
    accentLight: "#f5f5f5",
    accentText: "#ffffff",
    radius: "0px",
    tagBg: "#f5f5f5",
    sectionBorder: "#e5e5e5",
    divider: "#e5e5e5",
    font: "DM Sans",
  },
};

export const accentPresets = [
  "#7c3aed", "#6366f1", "#3b82f6", "#06b6d4",
  "#10b981", "#5b8c5a", "#eab308", "#f59e0b",
  "#f97316", "#ef4444", "#e940a0", "#ec4899",
  "#404040", "#78716c", "#b8860b", "#8b5cf6",
];

export function getTheme(id: string): Theme {
  return themes[id] || themes.claro;
}
