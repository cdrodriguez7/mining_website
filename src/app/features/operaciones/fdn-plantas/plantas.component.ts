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
  imageUrl?: string;
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
  locationMap?: string;
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
          name: 'Recepción y almacenamiento de los relaves',
          description: 'En este circuito la planta dispone de un área total de 137.45 m2 para el acopio de los relaves procedentes de las presas número 4, 5 y 6; junto a esta zona se encuentra un tanque de almacenamiento de agua para procesos de la Planta. El material llega a esta área con la ayuda de volquetes que trasladan los relaves desde las diferentes ubicaciones de las presas; ya en sitio, con ayuda de una excavadora se remueve el material y al mismo tiempo se incorpora agua a presión, con el objetivo de rehidratar el relave y dejar en las condiciones casi óptimas para los procesos posteriores.',
          status: 'activo',
          metrics: [
            { label: 'Área Acopio', value: '137.45 m²' },
            { label: 'Origen Material', value: 'Presas 4, 5 y 6' },
            { label: 'Método', value: 'Rehidratación a presión' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/1.%20ZONA%20DE%20ACOPIO%20DE%20RELAVES%20Y%20ALMACENAMIENTO%20DE%20AGUA.png'
        },
        {
          id: 'agi-lajo',
          name: 'Agitadores',
          description: 'Las pulpas provenientes del área de acopio, una vez rehidratado el relave; mediante bombeo llega a un distribuidor y posterior a ello, pasa a los tanques Agitadores de 3.00 m x 4.10 m (diámetro x altura), dentro de los cuales se busca homogenizar la mezcla de agua y arenas para su posterior adición de reactivos y espumantes.',
          status: 'activo',
          metrics: [
            { label: 'Dimensiones', value: '3.00 m x 4.10 m' },
            { label: 'Objetivo', value: 'Homogeneizar mezcla' },
            { label: 'Reactivos', value: 'Preparación' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/2.%20TANQUES%20DE%20AGITACI%C3%93N.png'
        },
        {
          id: 'aco-lajo',
          name: 'Tanques acondicionadores',
          description: 'Posterior al proceso de agitación, las pulpas pasan a los tanques Acondicionadores de 3.00 m x 4.10 m (diámetro x altura), con el objetivo de conseguir que los reactivos incorporados en este se mezclen completamente con la pulpa y pasen a las celdas de flotación primarias (Delkor).',
          status: 'activo',
          metrics: [
            { label: 'Dimensiones', value: '3.00 m x 4.10 m' },
            { label: 'Mezcla', value: 'Reactivos + pulpa' },
            { label: 'Destino', value: 'Celdas Delkor' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/3.%20TANQUES%20ACONDICIONADORES.png'
        },
        {
          id: 'flo-delkor',
          name: 'Celdas de flotación Delkor',
          description: 'Una vez dentro de las celdas primarias (Delkor) de tipo Serrano; también denominadas celdas Scavenger, se da el primer proceso de flotación donde se extraen las partículas que con mayor facilidad flotan. El primero concentrado que se extrae en estas celdas es enviado directamente a las cochas de concentrado, pues presenta una limpieza casi optima.',
          status: 'activo',
          metrics: [
            { label: 'Tipo Celdas', value: 'Serrano (Scavenger)' },
            { label: 'Primer Concentrado', value: 'Directo a cochas' },
            { label: 'Eficiencia', value: 'Alta selectividad' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/4.%20CELDAS%20DE%20FLOTACI%C3%93N%20DELKOR.png'
        },
        {
          id: 'flo-wemco',
          name: 'Celdas de flotación Wemco',
          description: 'La pulpa que ya haya pasado las primeras celdas, son dirigidas a una segunda celda de flotación (Wemco) de tipo Denver, y una celda circular del mismo tipo, de las cuales mediante un proceso más eficiente buscan flotar el resto de los minerales que aún se encuentran suspendidos en la pulpa. El concentrado que resultas de estas dos celdas, por sus condiciones de limpieza, es enviado a las dos últimas celdas del circuito denominadas de limpieza; y el resto de material resultante denominado relave es enviado a la presa de relaves.',
          status: 'activo',
          metrics: [
            { label: 'Modelos Celdas', value: 'Denver & Circular' },
            { label: 'Destino Concentrado', value: 'Celdas Limpieza' },
            { label: 'Destino Relave', value: 'Presa de relaves' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/5.%20CELDAS%20DE%20FLOTACI%C3%93N%20WENCO%20Y%20CELDA%20CIRCULAR.png'
        },
        {
          id: 'flo-limpieza',
          name: 'Celda circular y Celda de Limpieza',
          description: 'Las ultimas celdas, denominadas de limpieza, están compuesta por 2 celdas de flotación diferentes, una de banco simple y otra de banco doble, encargadas de flotar nuevamente el concentrado que se produce en las celdas anteriores y dejarlo en mejores condiciones de pureza. El concentrado que resulta de estas últimas celdas es enviado a la zona de cochas de concentrado, donde se unifican los concentrados resultantes de las diferentes celdas. Los residuos o relaves igualmente son enviados a la presa de relaves.',
          status: 'activo',
          metrics: [
            { label: 'Configuración', value: 'Banco simple / doble' },
            { label: 'Función', value: 'Limpieza / Pureza' },
            { label: 'Destino Concentrado', value: 'Cochas concentrado' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/6.%20CELDAS%20DE%20FLOTACI%C3%93N%20WEMCO%20DE%20LIMPIEZA.png'
        },
        {
          id: 'cochas-lajo',
          name: 'Cochas de Concentrado',
          description: 'Comprenden un número determinado de piscinas, construidas en muros de hormigón armado con una puerta. En este lugar es donde reposan todas las espumas de concentrado para que pierdan el agua, dejando únicamente las arenas de concentrado; que luego de una acumulación considerable se extrae y se coloca en los Big Bag y se los lleva al área de almacenamiento y carga de los mismos.',
          status: 'activo',
          metrics: [
            { label: 'Estructura', value: 'Muros hormigón' },
            { label: 'Deshidratación', value: 'Pérdida de agua' },
            { label: 'Presentación', value: 'Sacos Big Bag' }
          ],
          imageUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/etapas/7.%20COCHAS%20DE%20CONCENTRADO.png'
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
      ],
      locationMap: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/operaciones/plantas/lajo/planos/1.%20Ubicaci%C3%B3n.png'
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
