const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/app/features/operaciones/fdn-relaveras/relaveras.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const newSection = `

              <!-- Categoría 4: Estado Actual (Solo para Relaveras Inactivas) -->
              <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 space-y-3" *ngIf="activeRelavera.specs.infraestructuraExistente">
                <span class="text-orange-500 font-mono font-bold text-xs uppercase tracking-wider block border-b border-zinc-800/60 pb-2 flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Estado Actual
                  </span>
                </span>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3">
                    <span class="text-zinc-500 text-[9px] font-bold block uppercase tracking-wider mb-0.5">Infraestructura Existente</span>
                    <span class="text-zinc-150 font-mono font-extrabold text-xs block">{{ activeRelavera.specs.infraestructuraExistente }}</span>
                  </div>
                  <div class="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3">
                    <span class="text-zinc-500 text-[9px] font-bold block uppercase tracking-wider mb-0.5">Tipo</span>
                    <span class="text-zinc-150 font-extrabold text-xs block leading-tight">{{ activeRelavera.specs.tipoInfraestructura }}</span>
                  </div>
                  <div class="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3">
                    <span class="text-zinc-500 text-[9px] font-bold block uppercase tracking-wider mb-0.5">Área de Uso Actual</span>
                    <span class="text-zinc-150 font-mono font-extrabold text-xs block">{{ activeRelavera.specs.areaUsoActual }}</span>
                  </div>
                </div>
              </div>
`;

// Insert right before: <!-- Columna de Planos de Ingeniería CAD (5 cols) -->
html = html.replace('<!-- Columna de Planos de Ingeniería CAD (5 cols) -->', newSection + '\n              <!-- Columna de Planos de Ingeniería CAD (5 cols) -->');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML updated successfully');
