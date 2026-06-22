const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");

const langs = ["ar","de","el","en","es","fr","hi","id","it","ja","ko","nl","pl","pt","ro","ru","sv","th","tr","vi","zh-CN","zh-TW"];
for (const l of langs) {
  let idx;
  if (l.includes("-")) {
    idx = c.indexOf(`"${l}":`);
  } else {
    idx = c.indexOf(`  ${l}:`);
  }
  if (idx < 0) { console.log(`${l}: NOT FOUND`); continue; }
  const after = c.substring(idx, idx + 500);
  const hasSignOut = after.includes("signOut:");
  console.log(`${l}: has signOut=${hasSignOut}`);
}
