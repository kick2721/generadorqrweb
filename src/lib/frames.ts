export interface FrameDef {
  id: string;
  name: string;
  className: string;
}

export const FRAMES: FrameDef[] = [
  { id: "none", name: "Sin marco", className: "" },
  { id: "minimal", name: "Minimal", className: "p-1.5 bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg" },
  { id: "rounded", name: "Redondeado", className: "p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700" },
  { id: "shadow", name: "Sombra", className: "p-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-gray-800" },
  { id: "badge", name: "Insignia", className: "p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700" },
  { id: "double", name: "Doble borde", className: "p-2 bg-white dark:bg-gray-900 ring-1 ring-gray-300 dark:ring-gray-600 rounded-lg shadow-sm" },
  { id: "neon", name: "Neón", className: "p-2 bg-white dark:bg-gray-900 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50" },
  { id: "polaroid", name: "Polaroid", className: "p-4 pb-10 bg-white dark:bg-gray-900 rounded-sm shadow-md border border-gray-200 dark:border-gray-700" },
];

export function frameClass(id: string): string {
  return FRAMES.find(f => f.id === id)?.className ?? "";
}
