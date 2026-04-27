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
  descripcionGeneral = 'El complejo beneficiador de PLANPROMIN S.A. en Camilo Ponce Enríquez presta servicios de procesamiento de mineral y reprocesamiento de relaves para el sector minero artesanal y de pequeña escala de la zona. Con una capacidad autorizada de 1,000 toneladas por día, el complejo integra circuitos de trituración, molienda, concentración gravimétrica, flotación y cianuración para la recuperación de oro y metales asociados.';

  // Recepción y origen del mineral
  metodosAcceso = {
    titulo: 'Recepción de Mineral',
    descripcion: 'El complejo recibe mineral aurífero y relaves provenientes de los pequeños mineros y concesionarios de la zona de Camilo Ponce Enríquez. La operación integra dos plantas de beneficio que permiten atender distintos flujos de material.',
    metodos: [
      {
        nombre: 'Planta Principal PLANPROMIN',
        descripcion: 'Planta de beneficio con capacidad autorizada de 1,000 TPD (código 10000922), registrada ante el Ministerio de Energía y Minas. Procesa mineral fresco proveniente de los mineros de la zona.'
      },
      {
        nombre: 'Planta Lajo',
        descripcion: 'Planta de beneficio con capacidad de 400 TPD, operada bajo contrato de cesión de derechos. Complementa la capacidad de procesamiento para atender la demanda del sector.'
      },
      {
        nombre: 'Reprocesamiento de Relaves',
        descripcion: 'Sistema integral para el tratamiento de relaves históricos y actuales del sector. Los relaves ingresan a circuitos especializados para recuperar el oro residual que no fue extraído en procesos anteriores.'
      },
      {
        nombre: 'Control de Calidad de Ingreso',
        descripcion: 'Todo el mineral recibido pasa por muestreo y análisis en el laboratorio metalúrgico en sitio para determinar contenido de oro, leyes y caracterización mineralógica previo al procesamiento.'
      }
    ]
  };

  // Proceso de beneficio
  procesoBeneficio = {
    titulo: 'Circuito de Procesamiento',
    descripcion: 'El mineral y los relaves recibidos se procesan mediante un circuito integrado de trituración, molienda, concentración gravimétrica, flotación de sulfuros y lixiviación con carbón activado (CIL).',
    etapas: [
      {
        numero: 1,
        nombre: 'Trituración y Preparación',
        descripcion: 'El material ingresa a un circuito de trituración primaria y secundaria con molinos de bolas, reduciendo el tamaño de partícula hasta la malla de liberación óptima para la recuperación de oro libre y sulfuros portadores.'
      },
      {
        numero: 2,
        nombre: 'Concentración Gravimétrica',
        descripcion: 'El material molido pasa por un circuito de gravimetría que recupera el oro libre y grueso mediante concentradores centrífugos y mesas gravimétricas, capturando las partículas de mayor densidad antes de etapas posteriores.'
      },
      {
        numero: 3,
        nombre: 'Flotación de Sulfuros',
        descripcion: 'Los sulfuros portadores de oro (arsenopirita, pirrotina y calcopirita) se recuperan mediante celdas de flotación, generando un concentrado polimetálico que contiene oro ocluido junto con cobre y zinc como subproductos.'
      },
      {
        numero: 4,
        nombre: 'Lixiviación CIL',
        descripcion: 'Las colas de flotación ingresan al circuito de cianuración con carbón activado (CIL), donde el oro residual se disuelve y adsorbe en carbón activo. El oro se recupera por electrodeposición y fundición, produciendo barras de doré.'
      }
    ]
  };

  // Productos finales
  productosFinales = {
    titulo: 'Productos y Comercialización',
    productos: [
      {
        nombre: 'Barras de Doré',
        descripcion: 'Aleación oro-plata producida en la planta mediante fundición del material electrodepositado en el circuito CIL. Las barras son enviadas a refinería nacional para su purificación y posterior comercialización.',
        destino: 'Refinería nacional certificada'
      },
      {
        nombre: 'Concentrado Polimetálico',
        descripcion: 'Concentrado de sulfuros (Au-Cu-Zn) generado en el circuito de flotación. Contiene oro ocluido en la matriz de sulfuros y requiere tratamiento metalúrgico especializado para su beneficio final.',
        destino: 'Fundiciones y procesadores especializados'
      }
    ]
  };

  // Capacidad y throughput
  capacidadOperativa = {
    titulo: 'Capacidad del Complejo',
    capacidadActual: '1,400 toneladas/día',
    capacidadAnual: '~511,000 toneladas/año',
    recuperacionPromedio: '88%',
    leyPromedio: 'Variable según lote',
    metodoMinado: 'Beneficio de mineral de terceros y relaves',
    tipoPlanta: 'Gravimetría + Flotación + CIL'
  };

  // Infraestructura
  infraestructura = [
    'Circuito de trituración primaria y secundaria',
    'Molinos de bolas para molienda fina',
    'Concentradores gravimétricos centrífugos',
    'Mesas gravimétricas de acabado',
    'Celdas de flotación para sulfuros',
    'Circuito CIL con tanques de lixiviación',
    'Sistema de electrodeposición y fundición',
    'Planta de detoxificación de colas con cianuro',
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