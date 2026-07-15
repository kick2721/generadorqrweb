const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

const nl = content.includes("\r\n") ? "\r\n" : "\n";
const re = new RegExp(
  '(folderMoveHere: "[^"]+",)' + nl + "(\\s+folderPlaceholder)",
  "g"
);

const insert =
  '    folderSelectAll: "Select all",' +
  nl +
  '    folderDeselectAll: "Deselect all",' +
  nl +
  '    dashboardDeleteN: "Delete {n}",' +
  nl +
  '    dashboardBatchConfirmTitle: "Delete {n} QR codes?",' +
  nl +
  '    dashboardBatchConfirmDesc: "This will permanently delete {n} QR codes and all their scan data. This action cannot be undone.",' +
  nl;

content = content.replace(re, (_, l1, l2) => {
  return l1 + nl + insert + l2;
});

fs.writeFileSync(filePath, content, "utf8");
console.log("Inserted keys into all languages");
