import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

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
      name: 'Complejo Metalúrgico Planpromin (Principal)',
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
          url: 'assets/operaciones/plantas/shumiral/galeria/img-01.jpg',
          caption: 'Obras de infraestructura y celdas del circuito de flotación en el Complejo Metalúrgico Shumiral.'
        },
        {
          url: 'assets/operaciones/plantas/shumiral/galeria/img-02.jpg',
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
      technology: 'Reprocesamiento de relaves mediante rehidratación, agitación, acondicionamiento y celdas de flotación (Delkor, Wemco y celdas circulares/limpieza).',
      description: 'La Planta Lajo está dedicada al reprocesamiento y recuperación de metales preciosos (oro y plata) a partir de relaves acumulados en las presas número 4, 5 y 6. Utiliza un circuito completo de flotación de sulfuros para revalorizar arenas residuales.',
      coordinates: 'UTM 17S 633850E 9641720N',
      permitCode: 'CONTRATO CESIÓN DE DERECHOS',
      recoveryRate: '86.2%',
      recycledWater: '88.0%',
      establishedYear: 2024,
      stages: [
        {
          id: 'rec-lajo',
          name: 'Recepción y Almacenamiento',
          description: 'Área total de 137.45 m2 para el acopio de los relaves procedentes de las presas 4, 5 y 6, rehidratados con agua a presión para optimizar sus condiciones físicas.',
          status: 'activo',
          metrics: [
            { label: 'Área Acopio', value: '137.45 m²' },
            { label: 'Origen Material', value: 'Presas 4, 5 y 6' }
          ]
        },
        {
          id: 'agi-lajo',
          name: 'Agitadores',
          description: 'Homogeneización de la mezcla de agua y arenas mediante tanques agitadores de 3.00 m x 4.10 m antes de la adición de reactivos y espumantes.',
          status: 'activo',
          metrics: [
            { label: 'Dimensiones Tanque', value: '3.00m x 4.10m' },
            { label: 'Función', value: 'Homogeneizar pulpa' }
          ]
        },
        {
          id: 'aco-lajo',
          name: 'Tanques Acondicionadores',
          description: 'Tanques de 3.00 m x 4.10 m diseñados para lograr la mezcla completa de los reactivos incorporados en la pulpa antes de entrar al circuito de flotación.',
          status: 'activo',
          metrics: [
            { label: 'Dimensiones Tanque', value: '3.00m x 4.10m' },
            { label: 'Mezcla Reactivos', value: 'Completa' }
          ]
        },
        {
          id: 'flo-delkor',
          name: 'Celdas de Flotación Delkor',
          description: 'Celdas primarias Delkor tipo Serrano (Scavenger) para el primer proceso de flotación, enviando concentrado de alta pureza directo a cochas.',
          status: 'activo',
          metrics: [
            { label: 'Tipo Celdas', value: 'Serrano (Scavenger)' },
            { label: 'Primer Concentrado', value: 'Directo a cochas' }
          ]
        },
        {
          id: 'flo-wemco',
          name: 'Celdas de Flotación Wemco',
          description: 'Celdas Wemco tipo Denver y celda circular que flotan los minerales suspendidos residuales. El relave final es conducido a la presa de relaves.',
          status: 'activo',
          metrics: [
            { label: 'Modelos Celdas', value: 'Denver & Circular' },
            { label: 'Destino Relave', value: 'Presa de relaves' }
          ]
        },
        {
          id: 'flo-limpieza',
          name: 'Celda Circular & Limpieza',
          description: 'Celdas compuestas por banco simple y banco doble destinadas a la limpieza del concentrado wemco, incrementando significativamente la pureza final.',
          status: 'activo',
          metrics: [
            { label: 'Configuración', value: 'Banco simple / doble' },
            { label: 'Función', value: 'Enriquecimiento final' }
          ]
        },
        {
          id: 'cochas-lajo',
          name: 'Cochas de Concentrado',
          description: 'Piscinas construidas con muros de hormigón armado para la deshidratación por gravedad de las espumas de concentrado y empaque en Big Bags.',
          status: 'activo',
          metrics: [
            { label: 'Estructura', value: 'Hormigón armado' },
            { label: 'Presentación', value: 'Sacos Big Bag' }
          ]
        }
      ],
      images: [
        {
          url: 'assets/operaciones/plantas/lajo/galeria/img-01.jpg',
          caption: 'Vista general de las tolvas de recepción e infraestructura de Planta Lajo.'
        },
        {
          url: 'assets/operaciones/plantas/lajo/galeria/img-02.jpg',
          caption: 'Mantenimiento mecánico y calibración de las celdas de flotación.'
        }
      ]
    }
  ];

  ngOnInit(): void {
    // Inicializar con la primera etapa de la planta activa
    this.selectedStage = this.activePlanta.stages[0] || null;

    // Escuchar parámetros de consulta (ej: ?stage=flo-shumiral)
    this.route.queryParams.subscribe(params => {
      const stageId = params['stage'];
      if (stageId) {
        // Buscar a qué planta pertenece este stage y seleccionarla
        for (let i = 0; i < this.plantas.length; i++) {
          const stage = this.plantas[i].stages.find(s => s.id === stageId);
          if (stage) {
            this.activePlantaIndex = i;
            this.selectedStage = stage;
            this.activeTab = 'blueprint'; // Forzar la pestaña de flujograma
            break;
          }
        }
      }
    });
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
