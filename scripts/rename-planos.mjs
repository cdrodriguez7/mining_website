import fs from 'fs';
import path from 'path';

const dir = 'src/assets/operaciones/relaveras/fdn-1/planos';

const files = [
  { oldName: '1. a1 - A1 - IMPLN G..png', newName: 'plano-01.png' },
  { oldName: '2. UBICACIÓN DIQUE.png', newName: 'plano-02.png' },
  { oldName: '3. GEOUBICACION DE RELAVERA 7.png', newName: 'plano-03.png' },
  { oldName: '4. SECCIONES TRANSVERSALES DIQUE.png', newName: 'plano-04.png' },
  { oldName: '5. SISTEMA DE DRENAJE.png', newName: 'plano-05.png' },
  { oldName: '6. SECCIONES TIPICAS.png', newName: 'plano-06.png' }
];

files.forEach(f => {
  const oldPath = path.join(dir, f.oldName);
  const newPath = path.join(dir, f.newName);
  if (fs.existsSync(oldPath)) {
    console.log(`Renaming: ${f.oldName} -> ${f.newName}`);
    fs.renameSync(oldPath, newPath);
  } else {
    console.log(`File not found: ${f.oldName}`);
  }
});
console.log('Renaming complete.');
