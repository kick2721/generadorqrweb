const fs = require("fs");
const path = "src/lib/i18n.ts";

let content = fs.readFileSync(path, "utf8");
content = content.replace(/\r\n/g, "\n");

const missing = [
  "dashboardTitle","dashboardCreated","dashboardScans","dashboardPlan","dashboardFree",
  "dashboardEmpty","dashboardEmptyDesc","dashboardCreateFirst","dashboardNewQR","dashboardMyQRs",
  "dashboardScansLabel","dashboardDelete","dashboardStats","dashboardTotalScans","dashboardLast30",
  "dashboardRecent","dashboardDirect","dashboardConfirmTitle","dashboardConfirmDesc",
  "dashboardCancel","dashboardConfirmDelete",
  "save","saving","saved","themeLight","themeDark","signOut",
];

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

const lines = content.split("\n");
const out = [];
const langCodes = ["ar","de","el","en","es","fr","hi","id","it","ja","ko","nl","pl","pt","ro","ru","sv","th","tr","vi","zh-CN","zh-TW"];
let currentLang = null;

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const trimmed = raw.trim();
  
  // Detect language block start
  const langMatch = trimmed.match(/^(?:"?([a-z]{2}(?:-[A-Z]{2})?)"?):\s*\{$/);
  if (langMatch && langCodes.includes(langMatch[1])) {
    currentLang = langMatch[1];
    out.push(raw);
    continue;
  }
  
  // Detect end of block
  if (currentLang && (trimmed === "}," || trimmed === "}")) {
    const vals = currentLang === "en" ? en : currentLang === "es" ? es : {};
    for (const k of missing) {
      const v = vals[k] ?? k;
      out.push(`    ${k}: ${JSON.stringify(v)},`);
    }
    currentLang = null;
    out.push(raw);
    continue;
  }
  
  out.push(raw);
}

let result = out.join("\n");
result = result.replace(/\n/g, "\r\n");

const repl = result.match(/\ufffd/g);
console.log("Repl chars:", repl ? repl.length : 0);

for (const code of langCodes) {
  const has = result.includes(`"${code}":`) || result.includes(`  ${code}:`);
  const hasSignOut = result.includes(`"Sign out"`) || result.includes(`"Cerrar sesi`);
}
console.log("Has en signOut:", result.includes('"Sign out"'));
console.log("Has es signOut:", result.includes("Cerrar sesi"));
console.log("Final size:", result.length);

fs.writeFileSync(path, result, "utf8");
console.log("Written.");
