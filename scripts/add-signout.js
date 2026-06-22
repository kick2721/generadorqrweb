const fs = require("fs");
let content = fs.readFileSync("src/lib/i18n.ts", "utf8");

content = content.replace(
  /(themeDark:\s*"[^"]*"),\r\n(\s+\})/g,
  "$1,\r\n    signOut: \"signOut\",\r\n$2"
);

content = content.replace(
  /(perMonth:\s*"\/mes",[\s\S]*?signOut:\s*)"signOut"/,
  "$1\"Cerrar sesión\""
);

content = content.replace(
  /(perMonth:\s*"\/mo",[\s\S]*?signOut:\s*)"signOut"/,
  "$1\"Sign out\""
);

fs.writeFileSync("src/lib/i18n.ts", content);
console.log("Done");
