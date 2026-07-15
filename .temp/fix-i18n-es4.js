const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

// Find the Spanish section by unique marker
const esMarker = 'folderCancel: "Cancelar selecci\u00f3n"';
const esIdx = content.indexOf(esMarker);
if (esIdx === -1) {
  console.log("ERROR: Spanish section not found");
  process.exit(1);
}

// Find the 3 English keys that are AFTER the Spanish marker (within the Spanish block)
const key1 = 'dashboardSelected: "Selected"';
const key2 = 'folderMoveTo: "Move to folder"';
const key3 = 'folderExisting: "Existing folders"';

const idx1 = content.indexOf(key1, esIdx);
const idx2 = content.indexOf(key2, esIdx);
const idx3 = content.indexOf(key3, esIdx);

console.log("Found keys in ES section:", {
  key1: idx1 !== -1,
  key2: idx2 !== -1,
  key3: idx3 !== -1,
});

if (idx1 === -1 || idx2 === -1 || idx3 === -1) {
  console.log("ERROR: Could not find all keys in ES section");
  process.exit(1);
}

// Verify they are within ~100 chars of each other (same block, not across languages)
const maxSpan = Math.max(idx1, idx2, idx3) - Math.min(idx1, idx2, idx3);
console.log("Key span in bytes:", maxSpan);
if (maxSpan > 500) {
  console.log("WARNING: Keys span too far, may cross language boundaries");
}

// Replace locally
const before = content.substring(0, idx1);
const after = content.substring(idx1);
const updated = after
  .replace(key1, 'dashboardSelected: "Seleccionados"')
  .replace(key2, 'folderMoveTo: "Mover a carpeta"')
  .replace(key3, 'folderExisting: "Carpetas existentes"');

content = before + updated;

// Also update folderSelectMode in ES section
const esFSM = content.indexOf('folderSelectMode: "Seleccionar"', esIdx);
if (esFSM !== -1) {
  // It's already "Seleccionar" from the previous script that ran successfully
  // But let me check what it was before...
  console.log("folderSelectMode already updated as expected");
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Done - ES translations applied");
