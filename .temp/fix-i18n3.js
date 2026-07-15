const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "i18n.ts");
let content = fs.readFileSync(filePath, "utf8");

const nl = content.includes("\r\n") ? "\r\n" : "\n";

// Insert 3 new keys after every folderPlaceholder line
// Pattern: find "folderPlaceholder:" line and insert after it
const re = new RegExp(
  '(folderPlaceholder: "[^"]+",)' + nl + "(\\s+folderAll:)",
  "g"
);

const insert =
  '    dashboardSelected: "Selected",' +
  nl +
  '    folderMoveTo: "Move to folder",' +
  nl +
  '    folderExisting: "Existing folders",' +
  nl;

content = content.replace(re, (_, l1, l2) => {
  return l1 + nl + insert + l2;
});

fs.writeFileSync(filePath, content, "utf8");
console.log("Inserted 3 keys into all languages");
