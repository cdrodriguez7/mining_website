const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '../src/app/features/operaciones/fdn-relaveras/relaveras.component.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Add new properties to RelaveraSpecs interface
if (!tsContent.includes("infraestructuraExistente?: string;")) {
    tsContent = tsContent.replace(
        "soilClassification: string;",
        "soilClassification: string;\n  infraestructuraExistente?: string;\n  tipoInfraestructura?: string;\n  areaUsoActual?: string;"
    );
}

// Add the hardcoded overrides in ngOnInit
const overrideCode = `
          // Limpiar nulls
          Object.keys(r.specs).forEach(key => {
            if ((r.specs as any)[key] === null || (r.specs as any)[key] === 'null') {
              (r.specs as any)[key] = '';
            }
          });

          // Override for Relaveras 1, 2, 3
          if (r.name === 'Relavera #1') {
            r.specs.baseLevel = '127.00 msnm';
            r.specs.crestLevel = '142.00 msnm';
            r.specs.maxTailingLevel = '125.00 msnm';
            r.specs.crestWidth = '4.00 m';
            r.specs.freeboard = '2.00 m';
            r.specs.downstreamSlope = '2H:1V';
            r.specs.infraestructuraExistente = 'Si';
            r.specs.tipoInfraestructura = 'Campamento y Oficinas';
            r.specs.areaUsoActual = '0.59 ha';
          } else if (r.name === 'Relavera #2') {
            r.specs.baseLevel = '111.00 msnm';
            r.specs.crestLevel = '122.00 msnm';
            r.specs.maxTailingLevel = '120.00 msnm';
            r.specs.crestWidth = '5.00 m';
            r.specs.freeboard = '2.00 m';
            r.specs.downstreamSlope = '2H:1V';
            r.specs.infraestructuraExistente = 'No';
            r.specs.tipoInfraestructura = 'Terraplen';
            r.specs.areaUsoActual = '0.60 ha';
          } else if (r.name === 'Relavera #3') {
            r.specs.baseLevel = '110.00 msnm';
            r.specs.crestLevel = '120.00 msnm';
            r.specs.maxTailingLevel = '118.00 msnm';
            r.specs.crestWidth = '4.00 m';
            r.specs.freeboard = '2.00 m';
            r.specs.downstreamSlope = '2H:1V';
            r.specs.infraestructuraExistente = 'No';
            r.specs.tipoInfraestructura = 'AREA VERDE';
            r.specs.areaUsoActual = '0.44 ha';
          }
`;

tsContent = tsContent.replace(
    /\s*\/\/\s*Limpiar nulls[\s\S]*?\}\);\s*\n/g,
    overrideCode
);

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('TS updated with hardcoded specs');
