const fs = require("fs");
const path = "src/lib/i18n.ts";
let c = fs.readFileSync(path, "utf8");
c = c.replace(/\r\n/g, "\n");

const newKeys = [
  "dashboardTitle","dashboardCreated","dashboardScans","dashboardPlan","dashboardFree",
  "dashboardEmpty","dashboardEmptyDesc","dashboardCreateFirst","dashboardNewQR","dashboardMyQRs",
  "dashboardScansLabel","dashboardDelete","dashboardStats","dashboardTotalScans","dashboardLast30",
  "dashboardRecent","dashboardDirect","dashboardConfirmTitle","dashboardConfirmDesc",
  "dashboardCancel","dashboardConfirmDelete",
  "save","saving","saved","themeLight","themeDark","signOut",
];

const en = {};
newKeys.forEach(k => {
  switch (k) {
    case "dashboardTitle": en[k]="Dashboard";break;
    case "dashboardCreated": en[k]="QR Created";break;
    case "dashboardScans": en[k]="Total scans";break;
    case "dashboardPlan": en[k]="Current plan";break;
    case "dashboardFree": en[k]="Free";break;
    case "dashboardEmpty": en[k]="No QR codes yet";break;
    case "dashboardEmptyDesc": en[k]="Create your first QR code from the main page";break;
    case "dashboardCreateFirst": en[k]="Create free QR";break;
    case "dashboardNewQR": en[k]="+ New QR";break;
    case "dashboardMyQRs": en[k]="My QR Codes";break;
    case "dashboardScansLabel": en[k]="scans";break;
    case "dashboardDelete": en[k]="Delete";break;
    case "dashboardStats": en[k]="Statistics";break;
    case "dashboardTotalScans": en[k]="total scans";break;
    case "dashboardLast30": en[k]="Last 30 days";break;
    case "dashboardRecent": en[k]="Recent scans";break;
    case "dashboardDirect": en[k]="direct";break;
    case "dashboardConfirmTitle": en[k]="Delete QR";break;
    case "dashboardConfirmDesc": en[k]="Are you sure? This action cannot be undone and associated scans will also be deleted.";break;
    case "dashboardCancel": en[k]="Cancel";break;
    case "dashboardConfirmDelete": en[k]="Delete";break;
    case "save": en[k]="Save";break;
    case "saving": en[k]="Saving...";break;
    case "saved": en[k]="\u2705 Saved";break;
    case "themeLight": en[k]="\u2600\ufe0f Light mode";break;
    case "themeDark": en[k]="\U0001f319 Dark mode";break;
    case "signOut": en[k]="Sign out";break;
  }
});

const es = {};
newKeys.forEach(k => {
  switch (k) {
    case "dashboardTitle": es[k]="Dashboard";break;
    case "dashboardCreated": es[k]="QR Creados";break;
    case "dashboardScans": es[k]="Escaneos totales";break;
    case "dashboardPlan": es[k]="Plan actual";break;
    case "dashboardFree": es[k]="Gratuito";break;
    case "dashboardEmpty": es[k]="Todav\u00eda no tienes QR";break;
    case "dashboardEmptyDesc": es[k]="Crea tu primer c\u00f3digo QR desde la p\u00e1gina principal";break;
    case "dashboardCreateFirst": es[k]="Crear QR gratis";break;
    case "dashboardNewQR": es[k]="+ Nuevo QR";break;
    case "dashboardMyQRs": es[k]="Mis QR";break;
    case "dashboardScansLabel": es[k]="escaneos";break;
    case "dashboardDelete": es[k]="Eliminar";break;
    case "dashboardStats": es[k]="Estad\u00edsticas";break;
    case "dashboardTotalScans": es[k]="escaneos totales";break;
    case "dashboardLast30": es[k]="\u00daltimos 30 d\u00edas";break;
    case "dashboardRecent": es[k]="Escaneos recientes";break;
    case "dashboardDirect": es[k]="directo";break;
    case "dashboardConfirmTitle": es[k]="Eliminar QR";break;
    case "dashboardConfirmDesc": es[k]="\u00bfEst\u00e1s seguro? Esta acci\u00f3n no se puede deshacer y los escaneos asociados tambi\u00e9n se eliminar\u00e1n.";break;
    case "dashboardCancel": es[k]="Cancelar";break;
    case "dashboardConfirmDelete": es[k]="Eliminar";break;
    case "save": es[k]="Guardar";break;
    case "saving": es[k]="Guardando...";break;
    case "saved": es[k]="\u2705 Guardado";break;
    case "themeLight": es[k]="\u2600\ufe0f Modo claro";break;
    case "themeDark": es[k]="\U0001f319 Modo oscuro";break;
    case "signOut": es[k]="Cerrar sesi\u00f3n";break;
  }
});

const langCodes = ["ar","de","el","en","es","fr","hi","id","it","ja","ko","nl","pl","pt","ro","ru","sv","th","tr","uk","vi","zh-CN","zh-TW"];

// Build insertion string for a code
function insertFor(code) {
  const vals = code === "en" ? en : code === "es" ? es : {};
  return "\n" + newKeys.map(k => `    ${k}: ${JSON.stringify(vals[k] ?? k)},`).join("\n");
}

// Process each block - find `  code: {` and its matching closing `  },`
const lines = c.split("\n");
const out = [];
let i = 0;
let currentCode = null;
let blockLines = [];

function flushBlock() {
  if (currentCode && blockLines.length > 0) {
    // Check if keys already exist
    const hasKeys = newKeys.every(k => blockLines.some(l => l.trim().startsWith(k + ":")));
    if (!hasKeys) {
      const vals = currentCode === "en" ? en : currentCode === "es" ? es : {};
      const insertLines = newKeys.map(k => `    ${k}: ${JSON.stringify(vals[k] ?? k)},`);
      // Insert after the last `perMonth: "..."` line
      let lastPerMonth = -1;
      for (let j = blockLines.length - 1; j >= 0; j--) {
        if (blockLines[j].trim().startsWith("perMonth:")) {
          lastPerMonth = j;
          break;
        }
      }
      if (lastPerMonth >= 0) {
        blockLines.splice(lastPerMonth + 1, 0, ...insertLines);
      } else {
        // No perMonth found, insert right before closing
        blockLines.splice(blockLines.length - 1, 0, ...insertLines);
      }
    }
    out.push(...blockLines);
    blockLines = [];
  }
}

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();

  // Detect start of a language block
  const blockStart = trimmed.match(/^(?:"?([a-z]{2}(?:-[A-Z]{2})?)"?):\s*\{$/);
  if (blockStart && langCodes.includes(blockStart[1])) {
    flushBlock();
    currentCode = blockStart[1];
    blockLines.push(line);
    i++;
    continue;
  }

  if (currentCode) {
    blockLines.push(line);
    // Detect end of block
    if (trimmed === "}," || trimmed === "}") {
      flushBlock();
      currentCode = null;
    }
    i++;
    continue;
  }

  flushBlock();
  out.push(line);
  i++;
}
flushBlock();

let result = out.join("\n");
result = result.replace(/\n/g, "\r\n");

// Verify
console.log("Repl chars:", (result.match(/\ufffd/g) || []).length);
for (const code of langCodes) {
  const has = result.includes(`${code}:`) || result.includes(`"${code}":`);
  const hasSignOut = result.includes(`"${code}":`) ? 
    result.substring(result.indexOf(`"${code}":`), result.indexOf(`"${code}":`) + 800).includes("signOut:") :
    result.substring(result.indexOf(`  ${code}:`), result.indexOf(`  ${code}:`) + 800).includes("signOut:");
  console.log(code, hasSignOut ? "OK" : "MISSING");
}

fs.writeFileSync(path, result, "utf8");
console.log("Written!");
