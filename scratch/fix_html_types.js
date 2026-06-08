const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/app/features/operaciones/fdn-relaveras/relaveras.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Use non-null assertion operator activeFailureZones!. in the template 
// since we already wrap the sections with *ngIf="activeFailureZones".
// This will satisfy the TypeScript strict compiler.

html = html.replace(/activeFailureZones\./g, 'activeFailureZones!.');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML updated with non-null assertions');
