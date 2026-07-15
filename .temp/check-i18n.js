const fs = require("fs");
const c = fs.readFileSync("src/lib/i18n.ts", "utf8");
console.log("ES-dashboardSelected:", c.includes('dashboardSelected: "Seleccionados"'));
console.log("ES-folderMoveTo:", c.includes('folderMoveTo: "Mover a carpeta"'));
console.log("ES-folderExisting:", c.includes('folderExisting: "Carpetas existentes"'));
console.log("EN-dashboardSelected count:", c.split('dashboardSelected: "Selected"').length - 1);
console.log("Total dashboardSelected:", c.split("dashboardSelected").length - 1);
