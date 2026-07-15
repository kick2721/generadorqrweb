const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const esInsert = 
`    folderSelectAll: "Seleccionar todos",
    folderDeselectAll: "Deseleccionar todos",
    dashboardDeleteN: "Eliminar {n}",
    dashboardBatchConfirmTitle: "¿Eliminar {n} códigos QR?",
    dashboardBatchConfirmDesc: "Esto eliminará permanentemente {n} códigos QR y todos sus datos de escaneo. Esta acción no se puede deshacer.",`;

content = content.replace(
  '    folderCancel: "Cancelar selección",\n    folderMoveHere: "Mover a carpeta ({n})"',
  '    folderCancel: "Cancelar selección",\n    folderMoveHere: "Mover a carpeta ({n})",\n' + esInsert
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Spanish keys done');
