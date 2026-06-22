const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8").replace(/\r\n/g, "\n");

// Check ar block
const arStart = c.indexOf("\nar:");
const arEnd = c.indexOf("\nde:");
const arBlock = c.substring(arStart, arEnd);
console.log("Ar block length:", arBlock.length);
console.log("Last 300 chars of ar block:");
console.log(arBlock.slice(-300));
console.log("\n---\nHas dashboardTitle:", arBlock.includes("dashboardTitle:"));
console.log("Has signOut:", arBlock.includes("signOut:"));
