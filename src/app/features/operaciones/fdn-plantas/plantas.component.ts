import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

interface StageInfo {
  id: string;
  name: string;
  description: string;
  status: 'activo' | 'mantenimiento' | 'parada';
  metrics: { label: string; value: string }[];
}

interface Planta {
  id: string;
  name: string;
  status: string;
  statusClass: string;
  capacity: string;
  occupancy: number;
  technology: string;
  description: string;
  coordinates: string;
  permitCode: string;
  recoveryRate: string;
  recycledWater: string;
  establishedYear: number;
  stages: StageInfo[];
  images: { url: string; caption: string }[];
}

@Component({
  selector: 'app-fdn-plantas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.scss']
})
export class PlantasComponent implements OnInit {
  isLoading = false;
  activePlantaIndex = 0;
  activeTab: 'specs' | 'blueprint' | 'gallery' = 'blueprint';
  
  // Detalle del proceso seleccionado en el SVG
  selectedStage: StageInfo | null = null;
  
  // Control de zoom de imagen
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  
  // Carrusel index
  carouselIndex = 0;

  plantas: Planta[] = [
    {
      id: 'shumiral',
      name: 'Complejo Metalúrgico Shumiral (Principal)',
      status: 'Operación Continua 24/7',
      statusClass: 'bg-green-500',
      capacity: '2,040 TPD',
      occupancy: 84,
      technology: 'Circuito integrado de trituración primaria/secundaria, molienda fina en circuito cerrado, concentración gravimétrica Knelson, flotación diferencial de sulfuros, lixiviación CIL (Carbon in Leach), electrodeposición, fundición y detoxificación INCO SO2/Aire.',
      description: 'El Complejo Metalúrgico Shumiral es la planta insignia de PLANPROMIN S.A. Procesa tanto mineral fresco proveniente de pequeños mineros como relaves en su circuito de recuperación de colas. La planta cumple estrictamente con el estándar internacional de manejo de cianuro y cuenta con automatización SCADA en tiempo real.',
      coordinates: 'UTM 17S 634620E 9642350N',
      permitCode: 'REG. MINERO: 10000922',
      recoveryRate: '91.5%',
      recycledWater: '92.5%',
      establishedYear: 2024,
      stages: [
        {
          id: 'tri-shumiral',
          name: 'Trituración & Alimentación',
          description: 'Reducción de tamaño del mineral grueso mediante trituradoras de mandíbula y de cono. El mineral pasa por cribado dinámico para asegurar un tamaño menor a 1/2 pulgada antes del ingreso a tolvas de molienda.',
          status: 'activo',
          metrics: [
            { label: 'Tasa de Alimentación', value: '88.5 t/h' },
            { label: 'Tamaño del Producto', value: '< 12 mm' },
            { label: 'Consumo Eléctrico', value: '112 kW' }
          ]
        },
        {
          id: 'mol-shumiral',
          name: 'Molienda & Clasificación',
          description: '4 módulos independientes de molienda fina con molinos de bolas y clasificadores en espiral integrados con hidrociclones para obtener una liberación mineralógica óptima de malla -200 (75 micras).',
          status: 'activo',
          metrics: [
            { label: 'Densidad de Pulpa', value: '1,420 g/L' },
            { label: 'Finura (-200 mesh)', value: '78.2%' },
            { label: 'Estado de Molinos', value: '4/4 Operativos' }
          ]
        },
        {
          id: 'gra-shumiral',
          name: 'Concentración Gravimétrica',
          description: 'Recuperación de oro libre de alta densidad mediante concentradores centrífugos automáticos Knelson y mesas vibratorias de alta eficiencia, capturando el oro antes de la flotación.',
          status: 'activo',
          metrics: [
            { label: 'Eficiencia Gravimétrica', value: '38.5%' },
            { label: 'Ley del Concentrado', value: '285 g/t Au' },
            { label: 'Ciclo de Descarga', value: 'Cada 45 min' }
          ]
        },
        {
          id: 'flo-shumiral',
          name: 'Flotación de Sulfuros',
          description: 'Concentración de sulfuros auríferos (pirita, arsenopirita) mediante celdas de flotación primaria (rougher) y limpieza. Se produce un concentrado polimetálico rico en oro para comercialización.',
          status: 'activo',
          metrics: [
            { label: 'Recuperación Flotación', value: '92.1%' },
            { label: 'Ley de Conc. Flotación', value: '45.2.g/t Au' },
            { label: 'Consumo de Reactivos', value: '115 g/t' }
          ]
        },
        {
          id: 'cil-shumiral',
          name: 'Lixiviación CIL (Carbon in Leach)',
          description: 'Cianuración en 6 tanques de agitación mecánica en cascada con adición simultánea de carbón activado, maximizando la disolución del oro remanente en las colas de flotación.',
          status: 'activo',
          metrics: [
            { label: 'Tiempo de Residencia', value: '28 horas' },
            { label: 'Concentración de CN-', value: '180 ppm' },
            { label: 'Adsorción en Carbón', value: '3,850 g/t Au' }
          ]
        },
        {
          id: 'fun-shumiral',
          name: 'Desorción & Fundición',
          description: 'El carbón cargado con oro pasa por desorción a presión y alta temperatura (proceso Zadra). El oro disuelto se recupera en celdas electrolíticas y finalmente se funde para producir barras de doré.',
          status: 'activo',
          metrics: [
            { label: 'Temperatura de Horno', value: '1,180 °C' },
            { label: 'Eficiencia Desorción', value: '98.8%' },
            { label: 'Pureza de Barra Doré', value: '88.4% (Au+Ag)' }
          ]
        },
        {
          id: 'det-shumiral',
          name: 'Detoxificación (INCO SO2/Aire)',
          description: 'Tratamiento químico de los efluentes cianurados mediante el proceso INCO, destruyendo el cianuro libre y WAD antes de enviar el material tratado a la relavera en circuito cerrado.',
          status: 'activo',
          metrics: [
            { label: 'Cianuro Residual WAD', value: '0.85 ppm' },
            { label: 'Caudal Tratado', value: '42.5 L/s' },
            { label: 'Consumo de Oxígeno', value: '450 m³/h' }
          ]
        }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=1200&q=80',
          caption: 'Obras de infraestructura y celdas del circuito de flotación en el Complejo Metalúrgico Shumiral.'
        },
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
          caption: 'Molienda principal y clasificadores en espiral operando al 100% de su capacidad.'
        }
      ]
    },
    {
      id: 'lajo',
      name: 'Planta de Beneficio Lajo',
      status: 'Operación Programada',
      statusClass: 'bg-yellow-500',
      capacity: '400 TPD',
      occupancy: 65,
      technology: 'Molienda convencional, circuito de concentración gravimétrica, celdas de flotación bulk de sulfuros y espesamiento de concentrados.',
      description: 'La Planta Lajo es una instalación satélite operada bajo cesión de derechos contractuales. Permite procesar de manera dedicada lotes específicos de mineral artesanal de menor volumen, ayudando a la descongestión y optimización de capacidades del distrito.',
      coordinates: 'UTM 17S 633850E 9641720N',
      permitCode: 'CONTRATO CESIÓN DE DERECHOS',
      recoveryRate: '86.2%',
      recycledWater: '88.0%',
      establishedYear: 2024,
      stages: [
        {
          id: 'ali-lajo',
          name: 'Recepción & Alimentación',
          description: 'Alimentación de mineral grueso mediante tolvas de descarga. Clasificación por parrillas fijas para alimentar la trituradora de mandíbula.',
          status: 'activo',
          metrics: [
            { label: 'Alimentación Tolva', value: '18.2 t/h' },
            { label: 'Humedad Mineral', value: '6.5%' }
          ]
        },
        {
          id: 'mol-lajo',
          name: 'Circuito de Molienda Lajo',
          description: 'Molino de bolas de 8x8 pies que reduce el mineral en húmedo, acoplado a un clasificador de espiral mecánico para recircular las partículas gruesas.',
          status: 'activo',
          metrics: [
            { label: 'Tamaño de Carga', value: '-80% a malla 100' },
            { label: 'Consumo Eléctrico', value: '75 kW' }
          ]
        },
        {
          id: 'con-lajo',
          name: 'Concentración Gravimétrica',
          description: 'Mesa vibratoria concentradora de tableros estriados para capturar de manera directa el oro nativo y concentrar sulfuros gruesos de alto valor.',
          status: 'activo',
          metrics: [
            { label: 'Ley de Cabeza', value: '12.4 g/t Au' },
            { label: 'Recuperación Grav', value: '31.2%' }
          ]
        },
        {
          id: 'flo-lajo',
          name: 'Celdas de Flotación',
          description: 'Batería de 6 celdas de flotación sub-A para la separación colectiva de sulfuros con adición de xantatos y espumantes.',
          status: 'activo',
          metrics: [
            { label: 'Recuperación Colectiva', value: '84.8%' },
            { label: 'Ley de Concentrado', value: '32.1 g/t Au' }
          ]
        },
        {
          id: 'esp-lajo',
          name: 'Espesamiento & Filtrado',
          description: 'Espesador convencional para la sedimentación de concentrados polimetálicos y filtros de lona para deshidratar el producto final.',
          status: 'activo',
          metrics: [
            { label: 'Humedad Torta Filtro', value: '10.8%' },
            { label: 'Densidad Descarga', value: '1,550 g/L' }
          ]
        }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
          caption: 'Vista general de las tolvas de recepción e infraestructura de Planta Lajo.'
        },
        {
          url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
          caption: 'Mantenimiento mecánico y calibración de las celdas de flotación.'
        }
      ]
    }
  ];

  ngOnInit(): void {
    // Inicializar con la primera etapa de la planta activa
    this.selectedStage = this.activePlanta.stages[0] || null;
  }

  get activePlanta(): Planta {
    return this.plantas[this.activePlantaIndex];
  }

  selectPlanta(index: number): void {
    this.activePlantaIndex = index;
    this.carouselIndex = 0;
    this.selectedStage = this.activePlanta.stages[0] || null;
  }

  changeTab(tab: 'specs' | 'blueprint' | 'gallery'): void {
    this.activeTab = tab;
  }

  selectStage(stage: StageInfo): void {
    this.selectedStage = stage;
  }

  // Métodos de carrusel
  prevImage(): void {
    if (this.activePlanta.images.length === 0) return;
    this.carouselIndex = (this.carouselIndex - 1 + this.activePlanta.images.length) % this.activePlanta.images.length;
  }

  nextImage(): void {
    if (this.activePlanta.images.length === 0) return;
    this.carouselIndex = (this.carouselIndex + 1) % this.activePlanta.images.length;
  }

  setCarouselIndex(index: number): void {
    this.carouselIndex = index;
  }

  // Zoom de imagen
  openPreview(url: string, title: string): void {
    this.previewUrl = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}
