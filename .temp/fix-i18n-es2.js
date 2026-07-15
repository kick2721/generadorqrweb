const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

// Spanish section: replace the English keys with Spanish ones
const esOld =
  '    folderSelectAll: "Select all",\n    folderDeselectAll: "Deselect all",\n    dashboardDeleteN: "Delete {n}",\n    dashboardBatchConfirmTitle: "Delete {n} QR codes?",\n    dashboardBatchConfirmDesc: "This will permanently delete {n} QR codes and all their scan data. This action cannot be undone."';

// Find the Spanish section specifically - it's between the Portuguese and French sections
// Actually let me just use the exact Spanish context
const esNew =
  '    folderSelectAll: "Seleccionar todos",\n    folderDeselectAll: "Deseleccionar todos",\n    dashboardDeleteN: "Eliminar {n}",\n    dashboardBatchConfirmTitle: "¿Eliminar {n} códigos QR?",\n    dashboardBatchConfirmDesc: "Esto eliminar\u00e1 permanentemente {n} c\u00f3digos QR y todos sus datos de escaneo. Esta acci\u00f3n no se puede deshacer."';

// Find the Spanish section context uniquely
const ctx1 = 'folderCancel: "Cancelar selecci\u00f3n"';
const ctx2 = 'folderPlaceholder: "Nombre de carpeta"';

const idx1 = content.indexOf(ctx1);
const idx2 = content.indexOf(ctx2, idx1);

if (idx1 === -1 || idx2 === -1) {
  console.log("Could not find Spanish section");
  process.exit(1);
}

const before = content.substring(0, idx2);
const after = content.substring(idx2);

const esInsert =
  '    folderSelectAll: "Seleccionar todos",\n    folderDeselectAll: "Deseleccionar todos",\n    dashboardDeleteN: "Eliminar {n}",\n    dashboardBatchConfirmTitle: "\u00bfEliminar {n} c\u00f3digos QR?",\n    dashboardBatchConfirmDesc: "Esto eliminar\u00e1 permanentemente {n} c\u00f3digos QR y todos sus datos de escaneo. Esta acci\u00f3n no se puede deshacer.",\n    ';

content = before + esInsert + after;
fs.writeFileSync(filePath, content, "utf8");
console.log("Spanish keys translated");
