const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

// Find the Spanish section
const esMarker = 'folderCancel: "Cancelar selecci\u00f3n"';
const esIdx = content.indexOf(esMarker);
if (esIdx === -1) {
  console.log("ERROR: Spanish section not found");
  process.exit(1);
}

const replacements = [
  { from: 'folderSelectMode: "Seleccionar"', to: 'folderSelectMode: "Seleccionar"' },
  { from: 'folderSelectAll: "Select all"', to: 'folderSelectAll: "Seleccionar todos"' },
  { from: 'folderDeselectAll: "Deselect all"', to: 'folderDeselectAll: "Deseleccionar todos"' },
  { from: 'dashboardDeleteN: "Delete {n}"', to: 'dashboardDeleteN: "Eliminar {n}"' },
  { from: 'dashboardBatchConfirmTitle: "Delete {n} QR codes?"', to: 'dashboardBatchConfirmTitle: "\u00bfEliminar {n} c\u00f3digos QR?"' },
  { from: 'dashboardBatchConfirmDesc: "This will permanently delete {n} QR codes and all their scan data. This action cannot be undone."', to: 'dashboardBatchConfirmDesc: "Esto eliminar\u00e1 permanentemente {n} c\u00f3digos QR y todos sus datos de escaneo. Esta acci\u00f3n no se puede deshacer."' },
];

let count = 0;
for (const { from, to } of replacements) {
  const idx = content.indexOf(from, esIdx);
  if (idx !== -1 && idx < esIdx + 1500) {
    content = content.substring(0, idx) + to + content.substring(idx + from.length);
    count++;
  }
}

console.log(`Updated ${count} keys in ES section`);
fs.writeFileSync(filePath, content, "utf8");
