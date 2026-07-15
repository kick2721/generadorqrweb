const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

const esMarker = 'folderCancel: "Cancelar selecci\u00f3n"';
const esIdx = content.indexOf(esMarker);
if (esIdx === -1) {
  console.log("ERROR: Spanish section not found");
  process.exit(1);
}

// Fix folderSelectMode
const fsmIdx = content.indexOf('folderSelectMode: "Seleccionar para mover a carpetas"', esIdx);
if (fsmIdx !== -1 && fsmIdx < esIdx + 1000) {
  content = content.substring(0, fsmIdx) + 'folderSelectMode: "Seleccionar"' + content.substring(fsmIdx + 'folderSelectMode: "Seleccionar para mover a carpetas"'.length);
  console.log("Fixed folderSelectMode");
}

// Fix folderMoveTo and folderExisting
const fixes = [
  { key: "folderMoveTo", from: 'folderMoveTo: "Move to folder"', to: 'folderMoveTo: "Mover a carpeta"' },
  { key: "folderExisting", from: 'folderExisting: "Existing folders"', to: 'folderExisting: "Carpetas existentes"' },
];

for (const { key, from, to } of fixes) {
  const idx = content.indexOf(from, esIdx);
  if (idx !== -1 && idx < esIdx + 5000) {
    content = content.substring(0, idx) + to + content.substring(idx + from.length);
    console.log(`Fixed ${key}`);
  } else {
    console.log(`Could not find ${key} in ES section`);
  }
}

console.log("Done");
fs.writeFileSync(filePath, content, "utf8");
