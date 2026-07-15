const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");
const esMarker = 'folderCancel: "Cancelar selección"';
const idx = c.indexOf(esMarker);
// Check 200 chars before esMarker
const before = c.substring(Math.max(0, idx - 200), idx);
console.log("BEFORE folderCancel:", before);
