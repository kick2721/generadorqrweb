const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");
const esMarker = 'folderCancel: "Cancelar selección"';
const idx = c.indexOf(esMarker);
const block = c.substring(idx, idx + 1200);
console.log(block);
