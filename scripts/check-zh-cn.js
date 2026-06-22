const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");
// Find ar block
const arStart = c.indexOf("  ar:");
const arEnd = c.indexOf("  de:");
const arBlock = c.substring(arStart, arEnd);
console.log("Ar block starts at:", arStart);
console.log("Ar block ends at:", arEnd);
console.log("Ar block length:", arBlock.length);
console.log("Ar block last 200 chars:", JSON.stringify(arBlock.slice(-200)));
console.log("Has perMonth in ar:", arBlock.includes("perMonth:"));
console.log("Has dashboardTitle in ar:", arBlock.includes("dashboardTitle:"));
