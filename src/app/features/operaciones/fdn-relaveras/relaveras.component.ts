import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

interface SensorInfo {
  id: string;
  name: string;
  type: 'piezometro' | 'inclinometro' | 'drenaje' | 'acelerometro';
  value: string;
  status: 'normal' | 'alerta' | 'inactivo';
  x: number; // Coordenadas porcentuales para posicionar en el SVG
  y: number;
}

interface RelaveraImage {
  url: string;
  caption: string;
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
}

@Component({
  selector: 'app-fdn-relaveras',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './relaveras.component.html',
  styleUrls: ['./relaveras.component.scss']
})
export class RelaverasComponent implements OnInit {
  isLoading = false;
  activeRelaveraIndex = 0;
  activeTab: 'specs' | 'blueprint' | 'gallery' = 'blueprint';
  
  // Detalle del sensor seleccionado en el SVG
  selectedSensor: SensorInfo | null = null;
  
  // Control de zoom de imagen
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  
  // Carrusel index por relavera
  carouselIndex = 0;

  relaveras: Relavera[] = [
    {
      id: 'fdn-1',
      name: 'Relavera FDN-1 (Principal)',
      status: 'Reprocesamiento Activo',
      statusClass: 'bg-green-500',
      capacity: '320,000 m³',
      occupancy: 78,
      technology: 'Geomembrana de HDPE de 2.0 mm de doble textura, piezómetros automáticos de cuerda vibrante y canalización de lixiviados en circuito cerrado.',
      process: 'Recepción directa de lodos finos de la planta de beneficio y extracción de oro residual fino mediante flotación de colas y agitación química en reactores.',
      coordinates: 'UTM 17S 634500E 9642100N',
      damType: 'Presa de Tierra con Pantalla de Arcilla Homogénea',
      fsd: 1.65,
      height: '35 metros',
      foundation: 'Roca volcánica (Andesita) de alta compacidad y baja permeabilidad',
      constructionYear: 2018,
      waterReclamation: '92%',
      sensors: [
        { id: 'pz-1-1', name: 'Piezómetro PZ-01 (Núcleo)', type: 'piezometro', value: '24.3 kPa (Normal)', status: 'normal', x: 45, y: 55 },
        { id: 'pz-1-2', name: 'Piezómetro PZ-02 (Cimiento)', type: 'piezometro', value: '28.1 kPa (Normal)', status: 'normal', x: 42, y: 82 },
        { id: 'inc-1-1', name: 'Inclinómetro INC-01 (Talud)', type: 'inclinometro', value: '0.12 mm (Estable)', status: 'normal', x: 62, y: 45 },
        { id: 'dr-1-1', name: 'Medidor de Drenaje D-01', type: 'drenaje', value: '0.85 L/s (Normal)', status: 'normal', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1579847274704-039c9f7a77d1?auto=format&fit=crop&w=1200&q=80',
          caption: 'Obras de impermeabilización con geomembrana HDPE de 2.0 mm en el vaso del depósito FDN-1.'
        },
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
          caption: 'Construcción y compactación mecánica del dique de tierra y filtros de grava.'
        }
      ]
    },
    {
      id: 'ponce-sur',
      name: 'Relavera Ponce Sur',
      status: 'Reprocesamiento Activo',
      statusClass: 'bg-green-500',
      capacity: '180,000 m³',
      occupancy: 62,
      technology: 'Barreras geodrenantes tridimensionales, control sísmico acelerográfico en tiempo real e impermeabilización por arcillas compactadas.',
      process: 'Centrado en el lavado, clasificación granulométrica y recuperación secundaria de arenas gruesas con contenidos auríferos históricos del cantón.',
      coordinates: 'UTM 17S 634200E 9641800N',
      damType: 'Diquede Escollera con Núcleo de Arcilla Impermeable',
      fsd: 1.58,
      height: '24 metros',
      foundation: 'Coluvio denso sobre basamento basáltico competente',
      constructionYear: 2021,
      waterReclamation: '88%',
      sensors: [
        { id: 'pz-2-1', name: 'Piezómetro PZ-03 (Núcleo)', type: 'piezometro', value: '18.5 kPa (Normal)', status: 'normal', x: 45, y: 55 },
        { id: 'inc-2-1', name: 'Inclinómetro INC-02 (Coronación)', type: 'inclinometro', value: '0.05 mm (Estable)', status: 'normal', x: 50, y: 25 },
        { id: 'ac-2-1', name: 'Sismógrafo Acel-01', type: 'acelerometro', value: '0.002g (Sin actividad sísmica)', status: 'normal', x: 25, y: 90 },
        { id: 'dr-2-1', name: 'Medidor de Drenaje D-02', type: 'drenaje', value: '0.45 L/s (Normal)', status: 'normal', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=1200&q=80',
          caption: 'Instalación de geodrenes tridimensionales para disipación de la presión de poros.'
        },
        {
          url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80',
          caption: 'Vista del espejo de agua y el sistema de bombeo flotante para recirculación.'
        }
      ]
    },
    {
      id: 'el-salto',
      name: 'Relavera El Salto',
      status: 'Monitoreo y Estabilización',
      statusClass: 'bg-yellow-500',
      capacity: '240,000 m³',
      occupancy: 95,
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
        { id: 'pz-3-1', name: 'Piezómetro PZ-04 (Núcleo)', type: 'piezometro', value: '42.1 kPa (Bajo Monitoreo)', status: 'alerta', x: 45, y: 55 },
        { id: 'pz-3-2', name: 'Piezómetro PZ-05 (Filtro)', type: 'piezometro', value: '45.3 kPa (Bajo Monitoreo)', status: 'alerta', x: 55, y: 65 },
        { id: 'inc-3-1', name: 'Inclinómetro INC-03 (Talud)', type: 'inclinometro', value: '0.88 mm (Bajo Monitoreo)', status: 'alerta', x: 62, y: 45 },
        { id: 'dr-3-1', name: 'Medidor de Drenaje D-03', type: 'drenaje', value: '1.90 L/s (Estable)', status: 'normal', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
          caption: 'Monitoreo de taludes mediante lecturas de inclinómetros de precisión en El Salto.'
        },
        {
          url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
          caption: 'Estación telemétrica de sensores de nivel y presión instalada en el dique.'
        }
      ]
    },
    {
      id: 'mirador',
      name: 'Relavera Mirador',
      status: 'Cierre Técnico & Reforestación',
      statusClass: 'bg-blue-500',
      capacity: '150,000 m³',
      occupancy: 100,
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
        { id: 'pz-4-1', name: 'Piezómetro PZ-06 (Seco)', type: 'piezometro', value: '5.2 kPa (Inactivo/Seco)', status: 'inactivo', x: 45, y: 55 },
        { id: 'inc-4-1', name: 'Inclinómetro INC-04 (Estable)', type: 'inclinometro', value: '0.01 mm (Sin movimiento)', status: 'normal', x: 62, y: 45 },
        { id: 'dr-4-1', name: 'Dren Principal D-04', type: 'drenaje', value: '0.05 L/s (Efluente Cero)', status: 'normal', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1500627869374-13ad991b1116?auto=format&fit=crop&w=1200&q=80',
          caption: 'Proceso de revegetación y estabilización del talud de la Presa Mirador.'
        },
        {
          url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Reforestación experimental con especies nativas para mitigar la erosión eólica e hídrica.'
        }
      ]
    },
    {
      id: 'ponce-norte',
      name: 'Relavera Ponce Norte',
      status: 'En Preparación',
      statusClass: 'bg-orange-500',
      capacity: '200,000 m³',
      occupancy: 15,
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
        { id: 'pz-5-1', name: 'Piezómetro PZ-07', type: 'piezometro', value: '0.0 kPa (En calibración)', status: 'inactivo', x: 45, y: 55 },
        { id: 'inc-5-1', name: 'Inclinómetro INC-05', type: 'inclinometro', value: '0.00 mm (En calibración)', status: 'inactivo', x: 62, y: 45 },
        { id: 'dr-5-1', name: 'Medidor de Drenaje D-05', type: 'drenaje', value: '0.00 L/s (Seco)', status: 'inactivo', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1535730143503-04742784acaa?auto=format&fit=crop&w=1200&q=80',
          caption: 'Adecuación del canal perimetral de escorrentías e instalación de anclajes de geomembrana.'
        },
        {
          url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=80',
          caption: 'Integración del sistema telemétrico SCADA en la sala de control de operaciones de PLANPROMIN.'
        }
      ]
    },
    {
      id: 'rio-chico',
      name: 'Relavera Río Chico',
      status: 'Mitigación Ambiental Activa',
      statusClass: 'bg-yellow-500',
      capacity: '110,000 m³',
      occupancy: 88,
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
        { id: 'pz-6-1', name: 'Piezómetro PZ-08', type: 'piezometro', value: '33.2 kPa (Normal)', status: 'normal', x: 45, y: 55 },
        { id: 'inc-6-1', name: 'Inclinómetro INC-06', type: 'inclinometro', value: '0.24 mm (Estable)', status: 'normal', x: 62, y: 45 },
        { id: 'dr-6-1', name: 'Medidor de Drenaje D-06', type: 'drenaje', value: '1.15 L/s (Normal)', status: 'normal', x: 80, y: 78 }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1574689232449-19a9a0f7e53f?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sistema de cascadas de neutralización con cal activa para control preventivo de pH.'
        },
        {
          url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
          caption: 'Detalle de los filtros de absorción instalados para retención de metales disueltos.'
        }
      ]
    }
  ];

  ngOnInit(): void {
    // Inicializar con el primer sensor de la relavera activa para que no esté vacío
    this.selectedSensor = this.activeRelavera.sensors[0] || null;
  }

  get activeRelavera(): Relavera {
    return this.relaveras[this.activeRelaveraIndex];
  }

  selectRelavera(index: number): void {
    this.activeRelaveraIndex = index;
    this.carouselIndex = 0;
    this.selectedSensor = this.activeRelavera.sensors[0] || null;
  }

  changeTab(tab: 'specs' | 'blueprint' | 'gallery'): void {
    this.activeTab = tab;
  }

  selectSensor(sensor: SensorInfo): void {
    this.selectedSensor = sensor;
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

  // Métodos de zoom de imagen con ImagePreviewComponent
  openPreview(url: string, title: string): void {
    this.previewUrl = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}
