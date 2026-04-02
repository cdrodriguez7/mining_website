import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../../core/models/gallery.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-proceso-operativo',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './operativo.component.html',
  styleUrls: ['./operativo.component.scss']
})
export class OperativoComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  processImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  // Descripción general de operaciones
  descripcionGeneral = 'PLAMPROMIN S.A. opera una mina subterránea de extracción de minerales auríferos con planta de beneficio integrada. La capacidad actual de procesamiento es de 5,000 toneladas por día (tpd), con operaciones continuas que incluyen extracción, transporte, procesamiento y recuperación de oro y concentrados polimetálicos.';

  // Métodos de acceso a la mina
  metodosAcceso = {
    titulo: 'Acceso a la Mina',
    descripcion: 'La mina se accede mediante dos declinaciones principales: Kisa y Kuri. El método primario de extracción es long hole stoping (tumbe de bancos largos) con algunas secciones que utilizan métodos de corte y relleno.',
    metodos: [
      {
        nombre: 'Declinación Kisa',
        descripcion: 'Vía de acceso principal con inclinación de 15°, utilizada para transporte de personal, equipos y mineral'
      },
      {
        nombre: 'Declinación Kuri',
        descripcion: 'Vía de acceso secundaria para ventilación y salida de emergencia, con sistema de transporte auxiliar'
      },
      {
        nombre: 'Long Hole Stoping',
        descripcion: 'Método principal de extracción en vetas con potencias mayores a 2 metros, con perforación de barrenos largos y voladura controlada'
      },
      {
        nombre: 'Corte y Relleno',
        descripcion: 'Utilizado en zonas de vetas estrechas o áreas con condiciones geotécnicas especiales. El material estéril se usa como relleno cementado'
      }
    ]
  };

  // Proceso de beneficio
  procesoBeneficio = {
    titulo: 'Circuito de Procesamiento',
    descripcion: 'El mineral extraído se procesa mediante un circuito integrado que incluye trituración, molienda, concentración gravimétrica, flotación y lixiviación con carbón activado (CIL - Carbon in Leach).',
    etapas: [
      {
        numero: 1,
        nombre: 'Trituración y Molienda',
        descripcion: 'El mineral ingresa a un circuito de trituración primaria y secundaria mediante molinos SAG y de bolas, reduciendo el tamaño hasta alcanzar la malla de liberación óptima para la recuperación de oro.'
      },
      {
        numero: 2,
        nombre: 'Concentración Gravimétrica',
        descripcion: 'El material molido pasa por un circuito de gravimetría donde se recupera el oro libre mediante concentradores centrífugos y mesas gravimétricas, capturando las partículas de mayor densidad.'
      },
      {
        numero: 3,
        nombre: 'Flotación',
        descripcion: 'Los sulfuros portadores de oro (principalmente pirrotina, arsenopirita y calcopirita) se recuperan mediante flotación, generando un concentrado de sulfuros que contiene oro ocluido. Este proceso también recupera cobre y zinc como subproductos.'
      },
      {
        numero: 4,
        nombre: 'Lixiviación CIL',
        descripcion: 'Las colas de flotación ingresan al circuito de cianuración con carbón activado (CIL), donde el oro residual se disuelve y se adsorbe en carbón. El oro se recupera mediante electrodeposición y fundición, produciendo doré que se envía a refinería.'
      }
    ]
  };

  // Productos finales
  productosFinales = {
    titulo: 'Productos y Comercialización',
    productos: [
      {
        nombre: 'Concentrado de Oro',
        descripcion: 'Doré con pureza de 85-92% (oro-plata), producido en barras de 20 pies. Se transporta en contenedores blindados al puerto de Guayaquil para exportación a refinerías en Europa, Canadá, Taiwán y China.',
        destino: 'Refinerías internacionales certificadas'
      },
      {
        nombre: 'Concentrado de Flotación',
        descripcion: 'Concentrado polimetálico (Au-Cu-Zn) con contenidos variables de oro ocluido en sulfuros. Requiere tratamiento metalúrgico adicional debido al contenido de arsénico.',
        destino: 'Fundiciones especializadas'
      }
    ]
  };

  // Capacidad y throughput
  capacidadOperativa = {
    titulo: 'Capacidad Operativa',
    capacidadActual: '5,000 toneladas/día',
    capacidadAnual: '~1,825,000 toneladas/año',
    recuperacionPromedio: '91%',
    leyPromedio: '8.3 g/t Au',
    metodoMinado: 'Long hole stoping y corte-relleno',
    tipoPlanta: 'Gravimetría + Flotación + CIL'
  };

  // Infraestructura
  infraestructura = [
    'Sistema de trituración primaria y secundaria',
    'Molino SAG de alta eficiencia',
    'Circuito de molienda con molinos de bolas',
    'Concentradores gravimétricos Knelson',
    'Celdas de flotación para sulfuros',
    'Circuito CIL con 6 tanques de lixiviación',
    'Sistema de detoxificación de colas',
    'Planta de tratamiento de aguas residuales',
    'Relavera con sistema de recuperación de agua',
    'Laboratorio metalúrgico en sitio'
  ];

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService,
    private imageSelectorService: ImageSelectorService
  ) {}

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    try {
      this.isLoading = true;
      await this.galleryService.initializeForSection(SECTION_FOLDERS.OPERACIONES);
      
      const allImages = this.galleryService.getAllImages();
      
      if (allImages.length > 0) {
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });
        
        // Imágenes del proceso - planta, equipos, túneles
        this.processImages = allImages.slice(0, 2);
      }
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      this.isLoading = false;
    }
  }

  getHeroImageUrl(): string {
    if (!this.heroImage) return '';
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getImageUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 800);
  }

  openPreview(url: string, title: string): void {
    this.previewUrl   = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}