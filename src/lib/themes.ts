export type LayoutType = "list" | "grid";
export type HeaderVariant = "centered" | "decorative" | "minimal";
export type SectionVariant = "underline" | "bar" | "dotted";
export type CardVariant = "default" | "prominent-image" | "minimal";

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
  layout: LayoutType;
  headerVariant: HeaderVariant;
  sectionVariant: SectionVariant;
  cardVariant: CardVariant;
}

const premium: Theme = {
  id: "premium",
  label: "Premium",
  bg: "#f5f0eb",
  cardBg: "#ffffff",
  cardBorder: "1px solid #e5ddd0",
  cardShadow: "0 2px 12px rgba(0,0,0,0.05)",
  text: "#2d2416",
  textMuted: "#8a7a64",
  accent: "#c97b5e",
  accentLight: "#fdf6f2",
  accentText: "#ffffff",
  radius: "12px",
  tagBg: "#f5f0eb",
  sectionBorder: "#e5ddd0",
  divider: "#eee7dd",
  font: "Inter",
  layout: "list",
  headerVariant: "decorative",
  sectionVariant: "bar",
  cardVariant: "default",
};

const themes: Record<string, Theme> = { premium };

export const accentPresets = [premium.accent];

export function getTheme(_id?: string): Theme {
  return premium;
}
