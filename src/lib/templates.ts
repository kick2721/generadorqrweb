export interface DesignTemplate {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
  dotsType: string;
  cornersSquareType: string;
  cornersDotType: string;
  gradientType: string;
  gradientColor1: string;
  gradientColor2: string;
  frame: string;
}

const STORAGE_KEY = "qrwing_templates";

export function loadTemplates(): DesignTemplate[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveTemplate(t: Omit<DesignTemplate, "id">): DesignTemplate[] {
  const list = loadTemplates();
  const tmpl: DesignTemplate = { ...t, id: Date.now().toString(36) };
  list.unshift(tmpl);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  return list;
}

export function deleteTemplate(id: string): DesignTemplate[] {
  const list = loadTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
