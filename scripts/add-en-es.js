const fs = require("fs");
let c = fs.readFileSync("src/lib/i18n.ts", "utf8");
c = c.replace(/\r\n/g, "\n");

const en = {
  dashboardTitle:"Dashboard",dashboardCreated:"QR Created",dashboardScans:"Total scans",
  dashboardPlan:"Current plan",dashboardFree:"Free",
  dashboardEmpty:"No QR codes yet",dashboardEmptyDesc:"Create your first QR code from the main page",
  dashboardCreateFirst:"Create free QR",dashboardNewQR:"+ New QR",dashboardMyQRs:"My QR Codes",
  dashboardScansLabel:"scans",dashboardDelete:"Delete",dashboardStats:"Statistics",
  dashboardTotalScans:"total scans",dashboardLast30:"Last 30 days",dashboardRecent:"Recent scans",
  dashboardDirect:"direct",dashboardConfirmTitle:"Delete QR",
  dashboardConfirmDesc:"Are you sure? This action cannot be undone and associated scans will also be deleted.",
  dashboardCancel:"Cancel",dashboardConfirmDelete:"Delete",
  save:"Save",saving:"Saving...",saved:"\u2705 Saved",
  themeLight:"\u2600\ufe0f Light mode",themeDark:"\U0001f319 Dark mode",
  signOut:"Sign out",
};
const es = {
  dashboardTitle:"Dashboard",dashboardCreated:"QR Creados",dashboardScans:"Escaneos totales",
  dashboardPlan:"Plan actual",dashboardFree:"Gratuito",
  dashboardEmpty:"Todav\u00eda no tienes QR",
  dashboardEmptyDesc:"Crea tu primer c\u00f3digo QR desde la p\u00e1gina principal",
  dashboardCreateFirst:"Crear QR gratis",dashboardNewQR:"+ Nuevo QR",dashboardMyQRs:"Mis QR",
  dashboardScansLabel:"escaneos",dashboardDelete:"Eliminar",dashboardStats:"Estad\u00edsticas",
  dashboardTotalScans:"escaneos totales",dashboardLast30:"\u00daltimos 30 d\u00edas",
  dashboardRecent:"Escaneos recientes",dashboardDirect:"directo",
  dashboardConfirmTitle:"Eliminar QR",
  dashboardConfirmDesc:"\u00bfEst\u00e1s seguro? Esta acci\u00f3n no se puede deshacer y los escaneos asociados tambi\u00e9n se eliminar\u00e1n.",
  dashboardCancel:"Cancelar",dashboardConfirmDelete:"Eliminar",
  save:"Guardar",saving:"Guardando...",saved:"\u2705 Guardado",
  themeLight:"\u2600\ufe0f Modo claro",themeDark:"\U0001f319 Modo oscuro",
  signOut:"Cerrar sesi\u00f3n",
};

function buildLines(vals) {
  return Object.keys(vals).map(k => `    ${k}: ${JSON.stringify(vals[k])},`).join("\n");
}

const enInsert = buildLines(en);
const esInsert = buildLines(es);

// Insert into en block (after perMonth)
c = c.replace(/(\n  en: \{[\s\S]*?    perMonth: "[^"]*",?\n)([\s\S]*?\n  es: \{)/, "$1" + enInsert + "\n$2");
c = c.replace(/(\n  es: \{[\s\S]*?    perMonth: "[^"]*",?\n)([\s\S]*?\n  fr: \{)/, "$1" + esInsert + "\n$2");

c = c.replace(/\n/g, "\r\n");
fs.writeFileSync("src/lib/i18n.ts", c, "utf8");
console.log("Done");
