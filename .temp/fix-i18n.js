const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const insert = `    folderSelectAll: "Select all",
    folderDeselectAll: "Deselect all",
    dashboardDeleteN: "Delete {n}",
    dashboardBatchConfirmTitle: "Delete {n} QR codes?",
    dashboardBatchConfirmDesc: "This will permanently delete {n} QR codes and all their scan data. This action cannot be undone.",\n`;

content = content.replace(/(folderMoveHere: "[^"]+",)\n(\s+folderPlaceholder)/g, (match, line1, line2) => {
  return line1 + '\n' + insert + line2;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done - keys inserted');
