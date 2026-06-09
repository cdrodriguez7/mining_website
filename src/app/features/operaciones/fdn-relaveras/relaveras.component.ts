import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { environment } from '../../../../environments/environment';
import relaverasData from '../../../../../relaveras.json';

interface SensorInfo {
  id: string;
  name: string;
  type: 'piezometro' | 'inclinometro' | 'drenaje' | 'acelerometro';
  value: string;
  status: 'normal' | 'alerta' | 'inactivo';
  x: number; // Coordenadas porcentuales para posicionar en el SVG
  y: number;
}

interface FailureZone {
  id: 'pie' | 'talud' | 'corona';
  name: string;
  fs: number;
  risk: 'bajo' | 'moderado' | 'alto';
  description: string;
  analysis: string;
  variables: { label: string; value: string }[];
  stabilityImageUrl?: string;
}

interface RelaveraSpecs {
  baseLevel: string;
  crestLevel: string;
  maxTailingLevel: string;
  crestWidth: string;
  netCapacityVol: string;
  dryDensity: string;
  tonCapacity: string;
  upperArea: string;
  lowerArea: string;
  freeboard: string;
  damMaterialVol: string;
  excavationVol: string;
  downstreamSlope: string;
  liningType: string;
  hdpeInnerArea: string;
  hdpeOuterArea: string;
  soilClassification: string;
  infraestructuraExistente?: string;
  tipoInfraestructura?: string;
  areaUsoActual?: string;
}

interface RelaveraImage {
  url: string;
  caption: string;
}

interface StabilityImages {
  pie: string;
  talud: string;
  corona: string;
}

interface Relavera {
  id: string;
  name: string;
  status: string;
  statusClass: string;
  capacity: string;
  occupancy: number;
  technology: string;
  process: string;
  coordinates: string;
  damType: string;
  fsd: number; // Factor de Seguridad de Diseño
  height: string; // Altura del dique
  foundation: string; // Geología del cimiento
  constructionYear: number;
  waterReclamation: string; // % de agua recirculada
  sensors: SensorInfo[];
  images: RelaveraImage[];
  blueprints?: RelaveraImage[];
  specs?: RelaveraSpecs;
  stabilityImages: StabilityImages; // Imágenes de análisis de estabilidad por zona
  description?: string; // Descripción general de la relavera
}

@Component({
  selector: 'app-fdn-relaveras',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './relaveras.component.html',
  styleUrls: ['./relaveras.component.scss']
})
export class RelaverasComponent implements OnInit, OnDestroy {
  isLoading = false;
  activeRelaveraIndex = 0;
  activeTab: 'specs' | 'blueprint' | 'gallery' = 'blueprint';
  showMobileDetail = false;

  // Detalle del sensor seleccionado en el SVG
  selectedSensor: SensorInfo | null = null;
  selectedZone: FailureZone | null = null;

  // Control de zoom de imagen
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  previewImages: { url: string; title: string; description?: string }[] = [];
  previewIndex = 0;

  // Carrusel index por relavera
  carouselIndex = 0;
  blueprintCarouselIndex = 0;
  relaveras: Relavera[] = [
    {
      id: 'fdn-1',
      name: 'Relavera #7',
      status: 'Reprocesamiento Activo',
      statusClass: 'bg-green-500',
      capacity: '320,000 m³',
      occupancy: 70,
      technology: 'Geomembrana de HDPE de 2.0 mm de doble textura, piezómetros automáticos de cuerda vibrante y canalización de lixiviados en circuito cerrado.',
      process: 'Recepción directa de lodos finos de la planta de beneficio y extracción de oro residual fino mediante flotación de colas y agitación química en reactores.',
      coordinates: 'UTM 17S 634500E 9642100N',
      damType: 'Presa de Tierra con Pantalla de Arcilla Homogénea',
      fsd: 1.65,
      height: '30 metros',
      foundation: 'Roca volcánica (Andesita) de alta compacidad y baja permeabilidad',
      constructionYear: 2018,
      waterReclamation: '92%',
      sensors: [
        { id: 'pz-1-1', name: 'Piezómetro PZ-01 (Núcleo)', type: 'piezometro', value: '24.3 kPa (Normal)', status: 'normal', x: 50, y: 40 },
        { id: 'pz-1-2', name: 'Piezómetro PZ-02 (Cimiento)', type: 'piezometro', value: '28.1 kPa (Normal)', status: 'normal', x: 44, y: 73 },
        { id: 'inc-1-1', name: 'Inclinómetro INC-01 (Talud)', type: 'inclinometro', value: '0.12 mm (Estable)', status: 'normal', x: 28, y: 57 },
        { id: 'dr-1-1', name: 'Medidor de Drenaje D-01', type: 'drenaje', value: '0.85 L/s (Normal)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-01.jpg',
          caption: 'Obras de impermeabilización con geomembrana HDPE de 2.0 mm en el vaso del depósito FDN-1.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-02.jpg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-03.jpg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-04.png',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-05.jpeg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-06.jpeg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-07.jpeg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-08.jpeg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        },
        {
          url: 'assets/operaciones/relaveras/fdn-1/galeria/img-09.jpeg',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        }
      ],
      blueprints: [
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-01.png',
          caption: 'Implantación General (A1 - IMPLN G)'
        },
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-02.png',
          caption: 'Ubicación del Dique'
        },
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-03.png',
          caption: 'Geoubicación de Relavera 7'
        },
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-04.png',
          caption: 'Secciones Transversales del Dique'
        },
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-05.png',
          caption: 'Sistema de Drenaje'
        },
        {
          url: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/relaveras/fdn-1/planos/plano-06.png',
          caption: 'Secciones Típicas del Depósito'
        }
      ],
      specs: {
        baseLevel: '100.0 msnm',
        crestLevel: '130.0 m',
        maxTailingLevel: '127.00 m',
        crestWidth: '5.00 m',
        netCapacityVol: '322,041.84 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '708,492.05 Ton',
        upperArea: '24,014.65 m²',
        lowerArea: '3,119.50 m²',
        freeboard: '2.00 m',
        damMaterialVol: '336,772.91 m³',
        excavationVol: '335,545.78 m³',
        downstreamSlope: '1V:2H',
        liningType: 'Geomembrana HDPE 2.00 mm',
        hdpeInnerArea: '31,096.55 m²',
        hdpeOuterArea: '33,738.23 m²',
        soilClassification: 'Limos orgánicos, ML y MH'
      },
      stabilityImages: {
        pie: 'assets/operaciones/relaveras/fdn-1/estabilidad/pie.jpg',
        talud: 'assets/operaciones/relaveras/fdn-1/estabilidad/talud.jpg',
        corona: 'assets/operaciones/relaveras/fdn-1/estabilidad/corona.jpg'
      }
    },
    {
      id: 'ponce-sur',
      name: 'Relavera #5',
      status: 'Reprocesamiento Activo',
      statusClass: 'bg-green-500',
      capacity: '180,000 m³',
      occupancy: 5,
      technology: 'Barreras geodrenantes tridimensionales, control sísmico acelerográfico en tiempo real e impermeabilización por arcillas compactadas.',
      process: 'Centrado en el lavado, clasificación granulométrica y recuperación secundaria de arenas gruesas con contenidos auríferos históricos del cantón.',
      coordinates: 'UTM 17S 634200E 9641800N',
      damType: 'Dique de Escollera con Núcleo de Arcilla Impermeable',
      fsd: 1.58,
      height: '24 metros',
      foundation: 'Coluvio denso sobre basamento basáltico competente',
      constructionYear: 2021,
      waterReclamation: '88%',
      sensors: [
        { id: 'pz-2-1', name: 'Piezómetro PZ-03 (Núcleo)', type: 'piezometro', value: '18.5 kPa (Normal)', status: 'normal', x: 50, y: 40 },
        { id: 'inc-2-1', name: 'Inclinómetro INC-02 (Coronación)', type: 'inclinometro', value: '0.05 mm (Estable)', status: 'normal', x: 50, y: 22 },
        { id: 'ac-2-1', name: 'Sismógrafo Acel-01', type: 'acelerometro', value: '0.002g (Sin actividad sísmica)', status: 'normal', x: 28, y: 57 },
        { id: 'dr-2-1', name: 'Medidor de Drenaje D-02', type: 'drenaje', value: '0.45 L/s (Normal)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: 'assets/operaciones/relaveras/ponce-sur/galeria/img-01.jpg',
          caption: 'Instalación de geodrenes tridimensionales para disipación de la presión de poros.'
        },
        {
          url: 'assets/operaciones/relaveras/ponce-sur/galeria/img-02.jpg',
          caption: 'Vista del espejo de agua y el sistema de bombeo flotante para recirculación.'
        }
      ],
      blueprints: [
        {
          url: 'assets/operaciones/relaveras/ponce-sur/planos/plano-01.jpg',
          caption: 'Plano de zonificación del dique de escollera de Ponce Sur.'
        },
        {
          url: 'assets/operaciones/relaveras/ponce-sur/planos/plano-02.jpg',
          caption: 'Plano técnico del canal de coronación y vertederos de demasías.'
        }
      ],
      specs: {
        baseLevel: '100.0 msnm',
        crestLevel: '124.0 m',
        maxTailingLevel: '121.50 m',
        crestWidth: '4.50 m',
        netCapacityVol: '181,148.54 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '398,526.78 Ton',
        upperArea: '13,500.00 m²',
        lowerArea: '1,750.00 m²',
        freeboard: '2.50 m',
        damMaterialVol: '189,450.00 m³',
        excavationVol: '188,750.00 m³',
        downstreamSlope: '1V:2.2H',
        liningType: 'Arcilla compactada y Geodrenes',
        hdpeInnerArea: '17,490.00 m²',
        hdpeOuterArea: '18,970.00 m²',
        soilClassification: 'Gravas arcillosas, GC y SC'
      },
      stabilityImages: {
        pie: 'assets/operaciones/relaveras/ponce-sur/estabilidad/pie.png',
        talud: 'assets/operaciones/relaveras/ponce-sur/estabilidad/talud.png',
        corona: 'assets/operaciones/relaveras/ponce-sur/estabilidad/corona.png'
      }
    },
    {
      id: 'el-salto',
      name: 'Relavera #4',
      status: 'Material en Stock',
      statusClass: 'bg-yellow-500',
      capacity: '240,000 m³',
      occupancy: 10,
      technology: 'Drenes de chimenea de grava fina, inclinómetros digitales para registrar deformación angular y sensores de nivel freático.',
      process: 'Actualmente en reposo para consolidación física del material (disipación de presiones) previo al inicio del reprocesamiento masivo.',
      coordinates: 'UTM 17S 634800E 9642500N',
      damType: 'Presa de Grava con Pantalla de Concreto (CFRD)',
      fsd: 1.48,
      height: '30 metros',
      foundation: 'Esquisto arcilloso meteorizado compactado',
      constructionYear: 2015,
      waterReclamation: '95%',
      sensors: [
        { id: 'pz-3-1', name: 'Piezómetro PZ-04 (Núcleo)', type: 'piezometro', value: '42.1 kPa (Bajo Monitoreo)', status: 'alerta', x: 50, y: 40 },
        { id: 'pz-3-2', name: 'Piezómetro PZ-05 (Filtro)', type: 'piezometro', value: '45.3 kPa (Bajo Monitoreo)', status: 'alerta', x: 44, y: 73 },
        { id: 'inc-3-1', name: 'Inclinómetro INC-03 (Talud)', type: 'inclinometro', value: '0.88 mm (Bajo Monitoreo)', status: 'alerta', x: 28, y: 57 },
        { id: 'dr-3-1', name: 'Medidor de Drenaje D-03', type: 'drenaje', value: '1.90 L/s (Estable)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: 'assets/operaciones/relaveras/el-salto/galeria/img-01.jpg',
          caption: 'Monitoreo de taludes mediante lecturas de inclinómetros de precisión en El Salto.'
        },
        {
          url: 'assets/operaciones/relaveras/el-salto/galeria/img-02.jpg',
          caption: 'Estación telemétrica de sensores de nivel y presión instalada en el dique.'
        }
      ],
      blueprints: [
        {
          url: 'assets/operaciones/relaveras/el-salto/planos/plano-01.jpg',
          caption: 'Plano transversal del dique de El Salto mostrando la pantalla de concreto (CFRD).'
        },
        {
          url: 'assets/operaciones/relaveras/el-salto/planos/plano-02.jpg',
          caption: 'Esquema de disipación de presión de poros mediante drenes de chimenea.'
        }
      ],
      specs: {
        baseLevel: '100.0 msnm',
        crestLevel: '130.0 m',
        maxTailingLevel: '127.20 m',
        crestWidth: '5.00 m',
        netCapacityVol: '241,531.38 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '531,369.04 Ton',
        upperArea: '18,010.99 m²',
        lowerArea: '2,339.63 m²',
        freeboard: '2.80 m',
        damMaterialVol: '252,579.68 m³',
        excavationVol: '251,659.34 m³',
        downstreamSlope: '1V:2H',
        liningType: 'Pantalla de Concreto (CFRD)',
        hdpeInnerArea: '23,322.41 m²',
        hdpeOuterArea: '25,303.67 m²',
        soilClassification: 'Escollera limpia y Gravas limosas, GP y GM'
      },
      stabilityImages: {
        pie: 'assets/operaciones/relaveras/el-salto/estabilidad/pie.jpg',
        talud: 'assets/operaciones/relaveras/el-salto/estabilidad/talud.jpg',
        corona: 'assets/operaciones/relaveras/el-salto/estabilidad/corona.jpg'
      }
    },
    {
      id: 'mirador',
      name: 'Relavera #6',
      status: 'Material en Stock',
      statusClass: 'bg-yellow-500',
      capacity: '150,000 m³',
      occupancy: 10,
      technology: 'Cobertura multicapa sellada (suelo orgánico, geotextil, arcilla de sellado) con canales de coronación perimetrales de hormigón.',
      process: 'Fase de fitorremediación y siembra de especies endémicas locales para la restauración ecológica y estabilización biológica definitiva.',
      coordinates: 'UTM 17S 635100E 9642900N',
      damType: 'Presa Mixta (Tierra y Escollera) - Clausurada',
      fsd: 1.72,
      height: '18 metros',
      foundation: 'Basamento rocoso sano y seco',
      constructionYear: 2012,
      waterReclamation: '100% (Efluente Cero)',
      sensors: [
        { id: 'pz-4-1', name: 'Piezómetro PZ-06 (Seco)', type: 'piezometro', value: '5.2 kPa (Inactivo/Seco)', status: 'inactivo', x: 50, y: 40 },
        { id: 'inc-4-1', name: 'Inclinómetro INC-04 (Estable)', type: 'inclinometro', value: '0.01 mm (Sin movimiento)', status: 'normal', x: 28, y: 57 },
        { id: 'dr-4-1', name: 'Dren Principal D-04', type: 'drenaje', value: '0.05 L/s (Efluente Cero)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: 'assets/operaciones/relaveras/mirador/galeria/img-01.jpg',
          caption: 'Proceso de revegetación y estabilización del talud de la Presa Mirador.'
        },
        {
          url: 'assets/operaciones/relaveras/mirador/galeria/img-02.jpg',
          caption: 'Reforestación experimental con especies nativas para mitigar la erosión eólica e hídrica.'
        }
      ],
      blueprints: [
        {
          url: 'assets/operaciones/relaveras/mirador/planos/plano-01.jpg',
          caption: 'Plano final de clausura y cobertura multicapa del depósito Mirador.'
        },
        {
          url: 'assets/operaciones/relaveras/mirador/planos/plano-02.jpg',
          caption: 'Plano del sistema de subdrenaje y canales de escorrentía pluvial perimetral.'
        }
      ],
      specs: {
        baseLevel: '100.0 msnm',
        crestLevel: '118.0 m',
        maxTailingLevel: '115.50 m',
        crestWidth: '4.00 m',
        netCapacityVol: '150,957.11 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '332,105.65 Ton',
        upperArea: '11,250.00 m²',
        lowerArea: '1,460.00 m²',
        freeboard: '2.50 m',
        damMaterialVol: '157,860.00 m³',
        excavationVol: '157,290.00 m³',
        downstreamSlope: '1V:2.5H',
        liningType: 'Cobertura Arcilla y Suelo Orgánico (Sellada)',
        hdpeInnerArea: '14,570.00 m²',
        hdpeOuterArea: '15,810.00 m²',
        soilClassification: 'Limos arcillosos orgánicos de cobertura'
      },
      stabilityImages: {
        pie: 'assets/operaciones/relaveras/mirador/estabilidad/pie.png',
        talud: 'assets/operaciones/relaveras/mirador/estabilidad/talud.png',
        corona: 'assets/operaciones/relaveras/mirador/estabilidad/corona.png'
      }
    },
    {
      id: 'ponce-norte',
      name: 'Relavera #1',
      description: 'La Relavera 1 presenta infraestructura existente conformada por campamentos y oficinas, con un área de uso actual de 0,59 ha. Inicialmente, la estructura fue diseñada con un nivel base de 127,00 msnm, una cota de corona del dique de 142,00 msnm y un nivel máximo de llenado de 125,00 msnm. El diseño contempló un ancho de coronamiento de 4,00 m, un borde libre de 2,00 m y taludes aguas abajo con una relación 2H:1V. Actualmente, la relavera se encuentra en operación y conserva infraestructura asociada a sus actividades.',
      status: 'Material en Stock',
      statusClass: 'bg-yellow-500',
      capacity: '200,000 m³',
      occupancy: 100,
      technology: 'Contención lateral de grava compactada, geomembranas de bentonita de sodio auto-sellantes y sistema SCADA en fibra óptica.',
      process: 'Adecuación de bombas y tuberías de transporte de lodos para recibir material de relave disperso de la región para centralización.',
      coordinates: 'UTM 17S 633900E 9641500N',
      damType: 'Presa de Grava con Núcleo Geosintético',
      fsd: 1.85,
      height: '28 metros',
      foundation: 'Aluvión consolidado de alta densidad',
      constructionYear: 2025,
      waterReclamation: 'En fase de pruebas',
      sensors: [
        { id: 'pz-5-1', name: 'Piezómetro PZ-07', type: 'piezometro', value: '0.0 kPa (En calibración)', status: 'inactivo', x: 50, y: 40 },
        { id: 'inc-5-1', name: 'Inclinómetro INC-05', type: 'inclinometro', value: '0.00 mm (En calibración)', status: 'inactivo', x: 28, y: 57 },
        { id: 'dr-5-1', name: 'Medidor de Drenaje D-05', type: 'drenaje', value: '0.00 L/s (Seco)', status: 'inactivo', x: 56, y: 67 }
      ],
      images: [
        {
          url: '/assets/operaciones/relaveras/ponce-norte/galeria/relavera1.png',
          caption: 'Adecuación del canal perimetral de escorrentías e instalación de anclajes de geomembrana.'
        }
      ],
      blueprints: [
        {
          url: 'assets/operaciones/relaveras/ponce-norte/planos/plano-01.jpg',
          caption: 'Plano de diseño de la corona y núcleo geosintético de Ponce Norte.'
        },
        {
          url: 'assets/operaciones/relaveras/ponce-norte/planos/plano-02.jpg',
          caption: 'Esquema de tendido de fibra óptica para sensores SCADA en tiempo real.'
        }
      ],
      specs: {
        baseLevel: '127.00 msnm',
        crestLevel: '142.00 msnm',
        maxTailingLevel: '125.00 msnm',
        crestWidth: '4.00 m',
        netCapacityVol: '201,276.15 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '442,807.53 Ton',
        upperArea: '15,009.15 m²',
        lowerArea: '1,949.68 m²',
        freeboard: '2.00 m',
        damMaterialVol: '210,483.07 m³',
        excavationVol: '209,716.11 m³',
        downstreamSlope: '2H:1V',
        liningType: 'Geomembrana GCL (Bentonita)',
        hdpeInnerArea: '19,435.35 m²',
        hdpeOuterArea: '21,086.40 m²',
        soilClassification: 'Arenas limosas y Arcillas magras, SM y CL',
        infraestructuraExistente: 'Si',
        tipoInfraestructura: 'Campamento y Oficinas',
        areaUsoActual: '0.59 ha'
      },
      stabilityImages: {
        pie: 'assets/operaciones/relaveras/ponce-norte/estabilidad/pie.png',
        talud: 'assets/operaciones/relaveras/ponce-norte/estabilidad/talud.png',
        corona: 'assets/operaciones/relaveras/ponce-norte/estabilidad/corona.png'
      }
    },
    {
      id: 'rio-chico',
      name: 'Relavera #2',
      description: 'La Relavera 2 no presenta infraestructura existente y actualmente corresponde a una conformación tipo terraplén, con un área de uso de 0,60 ha. Inicialmente, la estructura fue diseñada con un nivel base de 111,00 msnm, una cota de corona del dique de 122,00 msnm y un nivel máximo de llenado de 120,00 msnm. El diseño contempló un ancho de coronamiento de 5,00 m, un borde libre de 2,00 m y taludes aguas abajo con una relación 2H:1V. En la actualidad, el área no cuenta con infraestructura asociada.',
      status: 'Material en Stock',
      statusClass: 'bg-yellow-500',
      capacity: '110,000 m³',
      occupancy: 100,
      technology: 'Filtros de carbón activo en serie y neutralización alcalina en cascada para tratamiento preventivo de drenaje ácido de roca.',
      process: 'Tratamiento activo y deshidratación de relaves antiguos expuestos a la intemperie por operaciones de terceros no controladas en el pasado.',
      coordinates: 'UTM 17S 634900E 9642300N',
      damType: 'Presa de Tierra compactada con contrafuertes de escollera',
      fsd: 1.51,
      height: '16 metros',
      foundation: 'Suelo limo-arcilloso consolidado',
      constructionYear: 2013,
      waterReclamation: '90%',
      sensors: [
        { id: 'pz-6-1', name: 'Piezómetro PZ-08', type: 'piezometro', value: '33.2 kPa (Normal)', status: 'normal', x: 50, y: 40 },
        { id: 'inc-6-1', name: 'Inclinómetro INC-06', type: 'inclinometro', value: '0.24 mm (Estable)', status: 'normal', x: 28, y: 57 },
        { id: 'dr-6-1', name: 'Medidor de Drenaje D-06', type: 'drenaje', value: '1.15 L/s (Normal)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: '/assets/operaciones/relaveras/rio-chico/galeria/relavera2.png',
          caption: 'Vista general del depósito Relavera #2 para control de material.'
        }
      ],
      blueprints: [
        {
          url: '/assets/operaciones/relaveras/rio-chico/planos/plano-01.jpg',
          caption: 'Plano de la presa y ubicación de contrafuertes de escollera de Río Chico.'
        },
        {
          url: '/assets/operaciones/relaveras/rio-chico/planos/plano-02.jpg',
          caption: 'Diagrama de flujo del sistema de cascadas de neutralización ácida.'
        }
      ],
      specs: {
        baseLevel: '111.00 msnm',
        crestLevel: '122.00 msnm',
        maxTailingLevel: '120.00 msnm',
        crestWidth: '5.00 m',
        netCapacityVol: '110,707.88 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '243,557.34 Ton',
        upperArea: '8,255.03 m²',
        lowerArea: '1,072.32 m²',
        freeboard: '2.00 m',
        damMaterialVol: '115,770.69 m³',
        excavationVol: '115,348.97 m³',
        downstreamSlope: '2H:1V',
        liningType: 'Geomembrana de PVC 1.50 mm',
        hdpeInnerArea: '10,689.87 m²',
        hdpeOuterArea: '11,598.63 m²',
        soilClassification: 'Limos y arcillas inorgánicas, CL y ML',
        infraestructuraExistente: 'No',
        tipoInfraestructura: 'Terraplen',
        areaUsoActual: '0.60 ha'
      },
      stabilityImages: {
        pie: '/assets/operaciones/relaveras/rio-chico/estabilidad/pie.png',
        talud: '/assets/operaciones/relaveras/rio-chico/estabilidad/talud.png',
        corona: '/assets/operaciones/relaveras/rio-chico/estabilidad/corona.png'
      }
    },
    {
      id: 'relavera-3',
      name: 'Relavera #3',
      description: 'La Relavera 3 no dispone de infraestructura existente y actualmente corresponde a un área verde con una superficie de 0,44 ha. En su diseño original, la estructura fue concebida con un nivel base de 110,00 msnm, una cota de corona del dique de 120,00 msnm y un nivel máximo de llenado de 118,00 msnm. Asimismo, se estableció un ancho de coronamiento de 4,00 m, un borde libre de 2,00 m y taludes aguas abajo con una pendiente de 2H:1V. Actualmente, la relavera no presenta edificaciones o instalaciones asociadas y el área se encuentra cubierta por vegetación.',
      status: 'Material en Stock',
      statusClass: 'bg-yellow-500',
      capacity: '130,000 m³',
      occupancy: 100,
      technology: 'Contención mediante dique de tierra compactada con filtros de arena y grava y control de instrumentación geotécnica.',
      process: 'Almacenamiento temporal de relaves consolidados para futuro reprocesamiento.',
      coordinates: 'UTM 17S 635200E 9642600N',
      damType: 'Presa de Tierra Homogénea',
      fsd: 1.55,
      height: '20 metros',
      foundation: 'Roca volcánica meteorizada compactada',
      constructionYear: 2017,
      waterReclamation: '92%',
      sensors: [
        { id: 'pz-7-1', name: 'Piezómetro PZ-09', type: 'piezometro', value: '15.2 kPa (Normal)', status: 'normal', x: 50, y: 40 },
        { id: 'inc-7-1', name: 'Inclinómetro INC-07', type: 'inclinometro', value: '0.08 mm (Estable)', status: 'normal', x: 28, y: 57 },
        { id: 'dr-7-1', name: 'Medidor de Drenaje D-07', type: 'drenaje', value: '0.35 L/s (Normal)', status: 'normal', x: 56, y: 67 }
      ],
      images: [
        {
          url: '/assets/operaciones/relaveras/relavera-3/galeria/relaver3.png',
          caption: 'Vista general del depósito Relavera #3 para control de material.'
        }
      ],
      blueprints: [
        {
          url: '/assets/operaciones/relaveras/relavera-3/planos/plano-01.jpg',
          caption: 'Plano transversal del dique de Relavera #3.'
        },
        {
          url: '/assets/operaciones/relaveras/relavera-3/planos/plano-02.jpg',
          caption: 'Esquema general de instrumentación y monitoreo.'
        }
      ],
      specs: {
        baseLevel: '110.00 msnm',
        crestLevel: '120.00 msnm',
        maxTailingLevel: '118.00 msnm',
        crestWidth: '4.00 m',
        netCapacityVol: '130,500.00 m³',
        dryDensity: '2.2 g/cm³',
        tonCapacity: '287,100.00 Ton',
        upperArea: '10,000.00 m²',
        lowerArea: '1,200.00 m²',
        freeboard: '2.00 m',
        damMaterialVol: '135,000.00 m³',
        excavationVol: '134,200.00 m³',
        downstreamSlope: '2H:1V',
        liningType: 'Geomembrana de PVC 1.50 mm',
        hdpeInnerArea: '12,500.00 m²',
        hdpeOuterArea: '13,200.00 m²',
        soilClassification: 'Limos arcillosos, CL y ML',
        infraestructuraExistente: 'No',
        tipoInfraestructura: 'AREA VERDE',
        areaUsoActual: '0.44 ha'
      },
      stabilityImages: {
        pie: '/assets/operaciones/relaveras/relavera-3/estabilidad/pie.png',
        talud: '/assets/operaciones/relaveras/relavera-3/estabilidad/talud.png',
        corona: '/assets/operaciones/relaveras/relavera-3/estabilidad/corona.png'
      }
    }
  ];


  ngOnInit(): void {
    // Mapear datos desde el JSON
    this.relaveras.forEach(r => {
      const normalizeName = (name: string) => name.toUpperCase().replace(/\s+/g, '').replace(/#/g, '');
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
          r.specs.excavationVol = e.capacidad_volumenes?.excavacion_vaso || r.specs.excavationVol;

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

      // Generación y combinación de la descripción técnica para todas las relaveras
      const baseDesc = r.description || '';
      const projDesc = this.generateProjectDescription(r);
      if (baseDesc) {
        r.description = `${projDesc}\n\n${baseDesc}`;
      } else {
        r.description = projDesc;
      }
    });

    // Convertir URLs locales a URLs de R2 si R2 está configurado
    const r2Url = environment.r2?.publicUrl?.replace(/\/$/, '');
    if (r2Url) {
      this.relaveras.forEach(r => {
        // 1. Imágenes de galería
        r.images?.forEach(img => {
          if (img.url && img.url.startsWith('assets/')) {
            img.url = `${r2Url}/${img.url}`;
          }
        });
        // 2. Planos (blueprints)
        r.blueprints?.forEach(bp => {
          if (bp.url && bp.url.startsWith('assets/')) {
            bp.url = `${r2Url}/${bp.url}`;
          }
        });
        // 3. Imágenes de análisis de estabilidad
        if (r.stabilityImages) {
          const si = r.stabilityImages;
          if (si.pie && si.pie.startsWith('assets/')) {
            si.pie = `${r2Url}/${si.pie}`;
          }
          if (si.talud && si.talud.startsWith('assets/')) {
            si.talud = `${r2Url}/${si.talud}`;
          }
          if (si.corona && si.corona.startsWith('assets/')) {
            si.corona = `${r2Url}/${si.corona}`;
          }
        }
      });
    }

    // Inicializar con el primer sensor de la relavera activa para que no esté vacío
    this.selectedSensor = this.activeRelavera.sensors[0] || null;
  }

  get activeRelavera(): Relavera {
    return this.relaveras[this.activeRelaveraIndex];
  }

  selectRelavera(index: number): void {
    this.activeRelaveraIndex = index;
    this.carouselIndex = 0;
    this.blueprintCarouselIndex = 0;
    this.selectedSensor = this.activeRelavera.sensors[0] || null;
    this.selectedZone = null;
    this.showMobileDetail = true;
    
    // Desactivar scroll del fondo si estamos en móvil para mejorar la navegación en el modal
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeMobileDetail(): void {
    this.showMobileDetail = false;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }
  }

  onBackdropClick(event: MouseEvent): void {
    // Cerrar el modal al hacer clic en el fondo oscuro
    this.closeMobileDetail();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.showMobileDetail) {
      this.closeMobileDetail();
    }
  }

  generateProjectDescription(r: Relavera): string {
    // 1. Obtener la superficie del proyecto (usar cota de área superior o fallback)
    let superficie = 'N/D';
    if (r.specs && r.specs.upperArea) {
      const m2 = parseFloat(r.specs.upperArea.replace(/,/g, ''));
      if (!isNaN(m2)) {
        superficie = `${(m2 / 10000).toFixed(4)} hectáreas`;
      } else {
        superficie = r.specs.upperArea;
      }
    }
    
    // Fallbacks específicos para Relaveras según enunciado técnico
    if (r.name === 'Relavera #1') superficie = '0.59 hectáreas';
    if (r.name === 'Relavera #2') superficie = '0.60 hectáreas';
    if (r.name === 'Relavera #3') superficie = '0.44 hectáreas';
    if (r.name === 'Relavera #7') superficie = '3.7644 hectáreas';

    // 2. Altura de talud
    const altura = r.height || '30 metros';

    // 3. Inclinación y material del dique
    let materialDique = 'material seleccionado compactado';
    if (r.specs && r.specs.soilClassification) {
      materialDique = r.specs.soilClassification;
    }
    
    // 4. Inclinación
    let inclinacion = '45°';
    if (r.name === 'Relavera #4') inclinacion = '47°';

    // 5. Flancos de excavación y dique (según orientación típica)
    let flancoExcavacion = 'SUR y SUR-ESTE';
    let flancoDique = 'Norte y Nor-Este';
    
    if (r.name === 'Relavera #2') {
      flancoExcavacion = 'OESTE';
      flancoDique = 'Este';
    } else if (r.name === 'Relavera #3') {
      flancoExcavacion = 'ESTE';
      flancoDique = 'Oeste';
    }

    return `El proyecto de la presa comprende una superficie de ${superficie} que corresponde a la superficie del proyecto o área útil para la infraestructura de la presa de relaves. ` +
           `La ejecución del proyecto se basará en la excavación y conformación de taludes internos del vaso aprovechando la cota y pendiente del terreno en el flanco ${flancoExcavacion} de la presa, donde se construye un talud de manera ascendente el cual no será mayor a 5.00 metros de altura y conservará una inclinación de ${inclinacion}. ` +
           `Por otro lado, en el flanco ${flancoDique} de la presa de relaves se conforma el dique utilizando material estéril de mina junto con el suelo natural excavado que básicamente se compone de ${materialDique}, siendo un material adecuado para conformar el cuerpo del dique.`;
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }
  }

  changeTab(tab: 'specs' | 'blueprint' | 'gallery'): void {
    this.activeTab = tab;
  }

  selectSensor(sensor: SensorInfo): void {
    this.selectedSensor = sensor;
    this.selectedZone = null;
  }

  selectZone(zone: FailureZone): void {
    this.selectedZone = zone;
    this.selectedSensor = null;
  }

  getZoneFill(fs: number): string {
    if (fs >= 1.5) return 'rgba(34,197,94,0.18)';
    if (fs >= 1.3) return 'rgba(234,179,8,0.22)';
    return 'rgba(239,68,68,0.25)';
  }

  getZoneStroke(fs: number): string {
    if (fs >= 1.5) return '#22c55e';
    if (fs >= 1.3) return '#eab308';
    return '#ef4444';
  }

  get activeFailureZones(): { pie: FailureZone; talud: FailureZone; corona: FailureZone } | null {
    const rel = this.activeRelavera;
    if (['Relavera #1', 'Relavera #2', 'Relavera #3'].includes(rel.name)) {
      return null;
    }

    const normalizeName = (name: string) => name.toUpperCase().replace(/\s+/g, '');
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
      addIfValid('Cohesión (c\')', zoneData.cohesion_c);
      addIfValid('Fricción (φ\')', zoneData.angulo_friccion_phi);
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
          { label: "Cohesión (c')", value: `${(18 + g * 3).toFixed(0)} kN/m²` },
          { label: "Fricción (φ')", value: `${(28 + g * 2).toFixed(0)}°` }
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
  }

  // Métodos del carrusel interno
  prevImage(): void {
    if (this.activeRelavera.images.length === 0) return;
    this.carouselIndex = (this.carouselIndex - 1 + this.activeRelavera.images.length) % this.activeRelavera.images.length;
  }

  nextImage(): void {
    if (this.activeRelavera.images.length === 0) return;
    this.carouselIndex = (this.carouselIndex + 1) % this.activeRelavera.images.length;
  }

  setCarouselIndex(index: number): void {
    this.carouselIndex = index;
  }

  // Métodos del carrusel de planos en Ficha Técnica
  prevBlueprint(): void {
    const blueprints = this.activeRelavera.blueprints || [];
    if (blueprints.length === 0) return;
    this.blueprintCarouselIndex = (this.blueprintCarouselIndex - 1 + blueprints.length) % blueprints.length;
  }

  nextBlueprint(): void {
    const blueprints = this.activeRelavera.blueprints || [];
    if (blueprints.length === 0) return;
    this.blueprintCarouselIndex = (this.blueprintCarouselIndex + 1) % blueprints.length;
  }

  setBlueprintIndex(index: number): void {
    this.blueprintCarouselIndex = index;
  }

  // Métodos de zoom de imagen con ImagePreviewComponent
  openPreview(url: string, title: string, index?: number, imagesArray?: RelaveraImage[]): void {
    if (index !== undefined && imagesArray && imagesArray.length > 0) {
      this.previewImages = imagesArray.map(img => ({
        url: img.url,
        title: img.caption || title,
        description: ''
      }));
      this.previewIndex = index;
    } else {
      this.previewImages = [];
      this.previewUrl = url;
      this.previewTitle = title;
    }
    this.previewVisible = true;
  }

  handlePreviewIndexChange(newIndex: number): void {
    this.previewIndex = newIndex;
    if (this.activeTab === 'gallery') {
      this.carouselIndex = newIndex;
    } else if (this.activeTab === 'blueprint') {
      this.blueprintCarouselIndex = newIndex;
    }
  }

  closePreview(): void {
    this.previewVisible = false;
    this.previewImages = [];
  }
}
