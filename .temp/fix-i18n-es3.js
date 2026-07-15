const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

// Update ES folderSelectMode
content = content.replace(
  'folderSelectMode: "Seleccionar para mover a carpetas"',
  'folderSelectMode: "Seleccionar"'
);

// Update ES dashboardSelected
content = content.replace(
  'dashboardSelected: "Selected"',
  'dashboardSelected: "Seleccionados"'
);

// Update ES folderMoveTo
content = content.replace(
  'folderMoveTo: "Move to folder"',
  'folderMoveTo: "Mover a carpeta"'
);

// Update ES folderExisting
content = content.replace(
  'folderExisting: "Existing folders"',
  'folderExisting: "Carpetas existentes"'
);

// Also update the base English section (first occurrence) to keep English as reference
// The English section is the first one, so first occurrence is English
// Let me NOT touch English - the keys already say "Selected", "Move to folder", "Existing folders" which is correct English

fs.writeFileSync(filePath, content, "utf8");
console.log("ES translations updated");
