const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");
const c2 = c.replace(/\r\n/g, "\n");
const lines = c2.split("\n");
let currentLang = null;
let hasPerMonth = false;
for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim();
  const lm = t.match(/^(?:"?([a-z]{2}(?:-[A-Z]{2})?)"?):\s*\{$/);
  if (lm) {
    currentLang = lm[1];
    hasPerMonth = false;
    continue;
  }
  if (currentLang && t.startsWith("perMonth:")) {
    hasPerMonth = true;
    continue;
  }
  if (currentLang && (t === "}," || t === "}")) {
    console.log(currentLang, "perMonth:", hasPerMonth, "extra keys after perMonth:", hasPerMonth && lines[i-1] ? lines[i-1].trim().substring(0,30) : "N/A");
    currentLang = null;
  }
}
