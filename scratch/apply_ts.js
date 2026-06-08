const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '../src/app/features/operaciones/fdn-relaveras/relaveras.component.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Add import
if (!tsContent.includes("import relaverasData")) {
    tsContent = tsContent.replace(
        "import { environment } from '../../../../environments/environment';",
        "import { environment } from '../../../../environments/environment';\nimport relaverasData from '../../../../../relaveras.json';"
    );
}

// Update ngOnInit
const ngOnInitReplacement = `
  ngOnInit(): void {
    // Mapear datos desde el JSON
    this.relaveras.forEach(r => {
      const normalizeName = (name: string) => name.toUpperCase().replace(/\\s+/g, '');
      const jsonRel = relaverasData.relaveras.find((j: any) => normalizeName(j.nombre_completo) === normalizeName(r.name));
      
      if (jsonRel) {
        if (jsonRel.datos_generales.estado) r.status = jsonRel.datos_generales.estado;
        if (jsonRel.datos_generales.capacidad_total) r.capacity = jsonRel.datos_generales.capacidad_total;
        if (jsonRel.datos_generales.ocupacion_actual_pct !== null) r.occupancy = Number(jsonRel.datos_generales.ocupacion_actual_pct);
        if (jsonRel.datos_generales.tecnologia_aplicada) r.technology = jsonRel.datos_generales.tecnologia_aplicada;
        if (jsonRel.datos_generales.proceso_operativo) r.process = jsonRel.datos_generales.proceso_operativo;
        if (jsonRel.datos_generales.coordenadas_UTM) r.coordinates = jsonRel.datos_generales.coordenadas_UTM;
        if (jsonRel.datos_generales.tipo_presa) r.damType = jsonRel.datos_generales.tipo_presa;
        if (jsonRel.datos_generales.FSD_factor_seguridad_diseno) r.fsd = Number(jsonRel.datos_generales.FSD_factor_seguridad_diseno);
        if (jsonRel.datos_generales.altura_dique) r.height = jsonRel.datos_generales.altura_dique.toString();
        if (jsonRel.datos_generales.geologia_cimiento) r.foundation = jsonRel.datos_generales.geologia_cimiento;
        if (jsonRel.datos_generales.anio_construccion) r.constructionYear = Number(jsonRel.datos_generales.anio_construccion);
        if (jsonRel.datos_generales.recuperacion_agua) r.waterReclamation = jsonRel.datos_generales.recuperacion_agua;

        if (jsonRel.especificaciones && r.specs) {
          const e = jsonRel.especificaciones as any;
          r.specs.baseLevel = e.cotas_geometria?.nivel_base_relavera || r.specs.baseLevel;
          r.specs.crestLevel = e.cotas_geometria?.corona_dique || r.specs.crestLevel;
          r.specs.maxTailingLevel = e.cotas_geometria?.max_llenado_relave || r.specs.maxTailingLevel;
          r.specs.crestWidth = e.cotas_geometria?.ancho_coronamiento || r.specs.crestWidth;
          r.specs.freeboard = e.cotas_geometria?.borde_libre || r.specs.freeboard;
          r.specs.downstreamSlope = e.cotas_geometria?.talud_aguas_abajo || r.specs.downstreamSlope;

          r.specs.netCapacityVol = e.capacidad_volumenes?.almacenamiento_neto || r.specs.netCapacityVol;
          r.specs.tonCapacity = e.capacidad_volumenes?.capacidad_en_peso || r.specs.tonCapacity;
          r.specs.dryDensity = e.capacidad_volumenes?.densidad_relave_seco || r.specs.dryDensity;
          r.specs.upperArea = e.capacidad_volumenes?.area_vaso_superior || r.specs.upperArea;
          r.specs.lowerArea = e.capacidad_volumenes?.area_vaso_inferior || r.specs.lowerArea;
          r.specs.damMaterialVol = e.capacidad_volumenes?.volumen_material_dique || r.specs.damMaterialVol;
          r.specs.excavationVol = e.capacidad_volumenes?.excavacion_vaso || r.specs.excavacionVol;

          r.specs.liningType = e.revestimiento_impermeabilizacion?.tipo_revestimiento || r.specs.liningType;
          r.specs.hdpeInnerArea = e.revestimiento_impermeabilizacion?.impermeabilizacion_vaso_interior || r.specs.hdpeInnerArea;
          r.specs.hdpeOuterArea = e.revestimiento_impermeabilizacion?.impermeabilizacion_taludes_dique || r.specs.hdpeOuterArea;
          r.specs.soilClassification = e.revestimiento_impermeabilizacion?.clasificacion_suelo_SUCS || r.specs.soilClassification;
          
          Object.keys(r.specs).forEach(key => {
            if ((r.specs as any)[key] === null || (r.specs as any)[key] === 'null') {
              (r.specs as any)[key] = '';
            }
          });
        }
      }
    });

    // Convertir URLs locales a URLs de R2 si R2 está configurado`;
tsContent = tsContent.replace(/ngOnInit\(\):\s*void\s*\{[\s\S]*?\/\/ Convertir URLs locales a URLs de R2 si R2 está configurado/, ngOnInitReplacement);


// Update activeFailureZones getter
const getterPattern = /get activeFailureZones\(\):\s*\{\s*pie:\s*FailureZone;\s*talud:\s*FailureZone;\s*corona:\s*FailureZone\s*\}\s*\{\s*const\s*rel\s*=\s*this\.activeRelavera;[\s\S]*?\}\s*;\s*\}/;

const newGetter = `get activeFailureZones(): { pie: FailureZone; talud: FailureZone; corona: FailureZone } | null {
    const rel = this.activeRelavera;
    if (['Relavera #1', 'Relavera #2', 'Relavera #3'].includes(rel.name)) {
      return null;
    }

    const normalizeName = (name: string) => name.toUpperCase().replace(/\\s+/g, '');
    const jsonRel = relaverasData.relaveras.find((j: any) => normalizeName(j.nombre_completo) === normalizeName(rel.name));

    const g = rel.fsd;
    let pieFs = Math.round(g * 0.92 * 100) / 100;
    let coronaFs = Math.round(g * 1.08 * 100) / 100;
    let taludFs = g;

    if (jsonRel && jsonRel.zonas_estabilidad) {
      if (jsonRel.zonas_estabilidad.pie_dique?.FS_pie) pieFs = Number(jsonRel.zonas_estabilidad.pie_dique.FS_pie);
      if (jsonRel.zonas_estabilidad.talud_medio?.FS_talud_medio) taludFs = Number(jsonRel.zonas_estabilidad.talud_medio.FS_talud_medio);
      if (jsonRel.zonas_estabilidad.corona_dique?.FS_corona) coronaFs = Number(jsonRel.zonas_estabilidad.corona_dique.FS_corona);
    }

    const risk = (fs: number): 'bajo' | 'moderado' | 'alto' =>
      fs >= 1.5 ? 'bajo' : fs >= 1.3 ? 'moderado' : 'alto';

    const buildVariables = (zoneData: any, fallbackVars: { label: string; value: string }[]) => {
      const vars: { label: string; value: string }[] = [];
      if (!zoneData) return fallbackVars;
      
      const addIfValid = (label: string, val: any) => {
        if (val !== null && val !== undefined && val !== 'null') {
          vars.push({ label, value: val.toString() });
        }
      };

      addIfValid('Capac. Admisible', zoneData.capacidad_admisible);
      addIfValid('Cohesión (c\\')', zoneData.cohesion_c);
      addIfValid('Fricción (φ\\')', zoneData.angulo_friccion_phi);
      addIfValid('Tipo de Drenaje', zoneData.tipo_drenaje);
      addIfValid('Tub. Colectora', zoneData.tuberia_colectora);
      addIfValid('Pend. Aguas Arriba', zoneData.pendiente_aguas_arriba);
      addIfValid('Pend. Aguas Abajo', zoneData.pendiente_aguas_abajo);
      addIfValid('Densidad Seca', zoneData.densidad_seca_relave);
      addIfValid('Cota Máxima', zoneData.cota_maxima_corona);
      addIfValid('Ancho Corona', zoneData.ancho_corona);
      addIfValid('Borde Libre', zoneData.borde_libre);
      
      return vars.length > 0 ? vars : fallbackVars;
    };

    return {
      pie: {
        id: 'pie',
        name: 'Pie del Dique',
        fs: pieFs,
        risk: risk(pieFs),
        description: 'Es el punto o zona de transición ubicada en la parte inferior del talud de la presa de relaves, donde la superficie inclinada intercepta el terreno de fundación, una berma o una plataforma inferior, constituyendo un elemento fundamental para la estabilidad geotécnica de la estructura. A esto se le suma en la parte inferior la cimentación o nivel de fundación que estabilizará toda la estructura del dique. Por otro lado, el drenaje subterráneo sirve para el control del nivel freático, así como para la eliminación del excedente de agua existente en el suelo con el fin de garantizar la estabilidad de la presa. Para ello se implementarán drenajes en el fondo del vaso con el sistema en espina de pez, que consiste en la construcción de zanjas, tubería microperforada, recubrimiento de grava gruesa y posterior evacuación a un tanque de recepción.',
        analysis: 'Estabilidad de Cimentación · Presión de Poros',
        variables: buildVariables(jsonRel?.zonas_estabilidad?.pie_dique, [
          { label: 'Capac. Admisible', value: '450 kPa' },
          { label: 'Tipo de Drenaje', value: 'Drenaje Subterráneo (Espina de Pez)' },
          { label: 'Tub. Colectora', value: 'Microperforada con Grava' },
          { label: "Cohesión (c')", value: \`\${(18 + g * 3).toFixed(0)} kN/m²\` },
          { label: "Fricción (φ')", value: \`\${(28 + g * 2).toFixed(0)}°\` }
        ]),
        stabilityImageUrl: rel.stabilityImages.pie
      },
      talud: {
        id: 'talud',
        name: 'Talud Medio',
        fs: taludFs,
        risk: risk(taludFs),
        description: 'El diseño y estabilidad de esta zona dependerá específicamente de la altura definitiva del dique y las fuerzas de empuje producidas por el relave, el material a colocar y sus propiedades geomecánicas. De esta manera, se le asignará una pendiente aguas arriba y aguas abajo para garantizar su seguridad, por ende, las pendientes varían entre 2H:1V, 3H:1V y 1.75H:1V. Para el proyecto de Relavera se ha propuesto bajo cálculo una pendiente equivalente a 2H:1V Aguas Abajo y 1H:1V Aguas arriba en la cual se han implementado bermas de 3 m de longitud cada 15 m de altura. El talud aguas arriba deberá protegerse de la acción destructiva de los relaves con geomembranas HDPE debido a que la parte sólida tiende a sedimentarse mientras que la líquida se filtrará hacia el dique.',
        analysis: 'Espina de Pez · Círculos de Deslizamiento',
        variables: buildVariables(jsonRel?.zonas_estabilidad?.talud_medio, [
          { label: 'Pend. Aguas Arriba', value: '1H:1V (Geomembrana HDPE)' },
          { label: 'Pend. Aguas Abajo', value: '2H:1V (Bermas de 3m c/15m)' },
          { label: 'Densidad Seca', value: '2.2 g/cm³' },
          { label: 'Altura Dique', value: rel.height }
        ]),
        stabilityImageUrl: rel.stabilityImages.talud
      },
      corona: {
        id: 'corona',
        name: 'Corona del Dique',
        fs: coronaFs,
        risk: risk(coronaFs),
        description: 'Se define como la superficie superior plana en la cota máxima del talud. El ancho recomendado dependerá del cálculo realizado al momento de diseñar la presa de relaves. Con el tiempo se producen movimientos en el terreno que causan grietas en el impermeabilizante y por lo tanto infiltraciones que conllevan a una disminución de la resistencia del suelo y por ende a su falla. La recomendación de impermeabilizar se debe adicionar con un correcto mantenimiento.',
        analysis: 'Espina de Pez',
        variables: buildVariables(jsonRel?.zonas_estabilidad?.corona_dique, [
          { label: 'Cota Máxima', value: '138 m.s.n.m' },
          { label: 'Ancho Corona', value: '5 m' },
          { label: 'Borde Libre', value: '2 m' }
        ]),
        stabilityImageUrl: rel.stabilityImages.corona
      }
    };
  }`;

tsContent = tsContent.replace(getterPattern, newGetter);

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('TS updated successfully');
