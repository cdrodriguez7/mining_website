const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/app/features/operaciones/fdn-relaveras/relaveras.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Wrap the ZONAS DE FALLA CLICKABLES in each SVG with ng-container
const replacePattern = /(<!-- ZONAS DE FALLA CLICKABLES \(OVERLAYS\) -->\s*(?:<!-- ZONA CORONA -->[\s\S]*?)?)<!-- SENSORES GEOTÉCNICOS INTERACTIVOS -->/g;

html = html.replace(replacePattern, (match, group1) => {
    return `<ng-container *ngIf="activeFailureZones">\n${group1}\n</ng-container>\n<!-- SENSORES GEOTÉCNICOS INTERACTIVOS -->`;
});

// Wrap the Panel de Leyenda y FS por Zona with *ngIf
const legendPattern = /(<!-- Panel de Leyenda y FS por Zona -->\s*)<div class="bg-black\/40 border border-zinc-800\/60 rounded-2xl p-4 flex flex-col gap-3">/;
html = html.replace(legendPattern, `$1<div class="bg-black/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-3" *ngIf="activeFailureZones">`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML updated successfully');
