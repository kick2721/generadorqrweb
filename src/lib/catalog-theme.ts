import type { CatalogTheme } from "./seed-data";
import { DEFAULT_THEME } from "./seed-data";

export const PRESET_THEMES: CatalogTheme[] = [
  {
    ...DEFAULT_THEME,
    bg: "#fef7ee",
    accent: "#c97b5e",
    pillActiveBg: "#c97b5e",
    font: "Inter",
  },
  {
    ...DEFAULT_THEME,
    bg: "#0f172a",
    cardBg: "#1e293b",
    text: "#f8fafc",
    muted: "#94a3b8",
    accent: "#f59e0b",
    accentText: "#0f172a",
    border: "#334155",
    pillBg: "#1e293b",
    pillText: "#f8fafc",
    pillActiveBg: "#f59e0b",
    pillActiveText: "#0f172a",
    font: "Inter",
    radius: "12px",
  },
  {
    ...DEFAULT_THEME,
    bg: "#f0fdf4",
    accent: "#16a34a",
    pillActiveBg: "#16a34a",
    font: "Inter",
    radius: "20px",
  },
  {
    ...DEFAULT_THEME,
    bg: "#fdf2f8",
    accent: "#db2777",
    pillActiveBg: "#db2777",
    font: "Inter",
    radius: "20px",
  },
  {
    ...DEFAULT_THEME,
    bg: "#fafaf9",
    accent: "#1f2937",
    pillActiveBg: "#1f2937",
    pillActiveText: "#ffffff",
    font: "Playfair Display",
    radius: "8px",
  },
];

export function getTheme(stored: Partial<CatalogTheme> | null | undefined): CatalogTheme {
  if (!stored) return { ...DEFAULT_THEME };
  return {
    ...DEFAULT_THEME,
    ...stored,
    showLogo: stored.showLogo ?? DEFAULT_THEME.showLogo,
  };
}

export function themeToCssVars(t: CatalogTheme): React.CSSProperties {
  return {
    backgroundColor: t.bg,
    color: t.text,
    ["--catalog-bg" as any]: t.bg,
    ["--catalog-card-bg" as any]: t.cardBg,
    ["--catalog-text" as any]: t.text,
    ["--catalog-muted" as any]: t.muted,
    ["--catalog-accent" as any]: t.accent,
    ["--catalog-accent-text" as any]: t.accentText,
    ["--catalog-border" as any]: t.border,
    ["--catalog-pill-bg" as any]: t.pillBg,
    ["--catalog-pill-text" as any]: t.pillText,
    ["--catalog-pill-active-bg" as any]: t.pillActiveBg,
    ["--catalog-pill-active-text" as any]: t.pillActiveText,
    ["--catalog-radius" as any]: t.radius,
  };
}
