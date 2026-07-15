const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

const nl = content.includes("\r\n") ? "\r\n" : "\n";

// Step 1: Insert 3 new keys after every folderPlaceholder line in all languages
const reInsert = new RegExp(
  `(folderPlaceholder: "[^"]+",)${nl}(\\s+folderAll:)`,
  "g"
);

const insert =
  '    dashboardSelected: "Selected",' +
  nl +
  '    folderMoveTo: "Move to folder",' +
  nl +
  '    folderExisting: "Existing folders",' +
  nl;

content = content.replace(reInsert, (_, l1, l2) => {
  return l1 + nl + insert + l2;
});

// Step 2: Update Spanish section specifically
// Find the Spanish section by its unique Spanish text
const esMarker = 'folderCancel: "Cancelar selecci\u00f3n"';
const esIdx = content.indexOf(esMarker);
if (esIdx === -1) {
  console.log("ERROR: Could not find Spanish section");
  process.exit(1);
}

// Find the 3 keys within the Spanish section and replace
// The Spanish section starts at esMarker and ends at the next language's folderSelectMode
// Let me find the exact positions of the 3 keys that follow folderPlaceholder in the ES section

// First find folderPlaceholder after esMarker
const afterEs = content.substring(esIdx);
const fphIdx = afterEs.indexOf('folderSelectMode: "Seleccionar"');
if (fphIdx === -1) {
  console.log("ERROR: Could not find folderSelectMode in ES section");
}

// Replace the 3 keys locally - find their positions in the full content
const esBlockStart = content.indexOf('folderSelectMode: "Seleccionar"', esIdx);
const esBlockEnd = content.indexOf("\n  ", esBlockStart + 50); // next top-level key (indented with 2 spaces)

// Extract the ES block
const esBlock = content.substring(esBlockStart - 200, esBlockStart + 600);

// Replace in esBlock
const updatedEsBlock = esBlock
  .replace('dashboardSelected: "Selected"', 'dashboardSelected: "Seleccionados"')
  .replace('folderMoveTo: "Move to folder"', 'folderMoveTo: "Mover a carpeta"')
  .replace('folderExisting: "Existing folders"', 'folderExisting: "Carpetas existentes"')
  .replace(
    'folderSelectMode: "Seleccionar"',
    'folderSelectMode: "Seleccionar"'
  ); // no-op, already correct

// Put it back
content =
  content.substring(0, esBlockStart - 200) +
  updatedEsBlock +
  content.substring(esBlockStart + 400);

// Verify
const verify1 = content.includes('dashboardSelected: "Seleccionados"');
const verify2 = content.includes('folderMoveTo: "Mover a carpeta"');
const verify3 = content.includes('folderExisting: "Carpetas existentes"');
const countSelected = content.split('dashboardSelected: "Selected"').length - 1;
const countMover = content.split('folderMoveTo: "Move to folder"').length - 1;
const countExisting = content.split('folderExisting: "Existing folders"').length - 1;

fs.writeFileSync(filePath, content, "utf8");
console.log("ES section updated:", { verify1, verify2, verify3 });
console.log("Remaining English counts (should be 22):", {
  selected: countSelected,
  mover: countMover,
  existing: countExisting,
});
