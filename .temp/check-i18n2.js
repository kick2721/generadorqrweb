const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");

const esMarker = 'folderCancel: "Cancelar selecci\u00f3n"';
const esIdx = c.indexOf(esMarker);

const checks = [
  "folderSelectMode",
  "folderSelectAll",
  "folderDeselectAll",
  "dashboardDeleteN",
  "dashboardBatchConfirmTitle",
  "dashboardBatchConfirmDesc",
  "dashboardSelected",
  "folderMoveTo",
  "folderExisting",
];

for (const key of checks) {
  const idx = c.indexOf(key, esIdx);
  if (idx === -1 || idx >= esIdx + 500) {
    console.log(`  ${key}: NOT FOUND in ES section`);
  } else {
    // Extract the line
    const lineEnd = c.indexOf("\n", idx);
    const lineStart = c.lastIndexOf("\n", idx) + 1;
    const line = c.substring(lineStart, lineEnd).trim();
    console.log(`  ${line}`);
  }
}
