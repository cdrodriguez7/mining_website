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

interface HitoHistorico {
  ano: string;
  titulo: string;
  descripcion: string;
  icono: string;
  lado: 'izquierda' | 'derecha';
}

@Component({
  selector: 'app-operaciones-historia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  historyImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  subtitulo = 'Trayectoria del complejo beneficiador al servicio de la minería artesanal de Camilo Ponce Enríquez.';

  // Timeline de hitos históricos
  hitos: HitoHistorico[] = [
    {
      ano: '1990s',
      titulo: 'Actividad Minera Artesanal en CPE',
      descripcion: 'La zona de Camilo Ponce Enríquez concentra una intensa actividad minera artesanal y de pequeña escala, con numerosos mineros extrayendo mineral aurífero de las vetas y estructuras del distrito.',
      icono: '⛏️',
      lado: 'derecha'
    },
    {
      ano: '2001',
      titulo: 'Constitución de PLANPROMIN S.A.',
      descripcion: 'Se constituye PLANPROMIN S.A. con el objetivo de prestar servicios de beneficio de minerales al sector minero artesanal y de pequeña escala de la zona de Camilo Ponce Enríquez.',
      icono: '🏢',
      lado: 'izquierda'
    },
    {
      ano: '2003',
      titulo: 'Primer Registro de Planta',
      descripcion: 'Obtención del primer registro de planta de beneficio ante la Dirección Nacional de Minería (DINAMI), autorizando el procesamiento de mineral aurífero proveniente de concesionarios de la zona.',
      icono: '📋',
      lado: 'derecha'
    },
    {
      ano: '2006',
      titulo: 'Ampliación del Complejo',
      descripcion: 'Primera expansión significativa del complejo beneficiador. Incorporación de celdas de flotación para la recuperación de sulfuros portadores de oro y modernización del circuito de molienda.',
      icono: '🔧',
      lado: 'izquierda'
    },
    {
      ano: '2009',
      titulo: 'Instalación del Circuito CIL',
      descripcion: 'Instalación del circuito de lixiviación con carbón activado (CIL), integrando la etapa de cianuración al proceso. El CIL elevó la recuperación metalúrgica global y permitió la producción de barras de doré en sitio.',
      icono: '⚙️',
      lado: 'derecha'
    },
    {
      ano: '2012',
      titulo: 'Autorización 1,000 TPD',
      descripcion: 'El Ministerio de Energía y Minas otorga autorización formal para operar la planta principal con capacidad de 1,000 toneladas por día (código 10000922), consolidando el estatus regulatorio del complejo.',
      icono: '✅',
      lado: 'izquierda'
    },
    {
      ano: '2015',
      titulo: 'Incorporación de Planta Lajo',
      descripcion: 'Firma de contrato de cesión de derechos para operar la Planta Lajo (400 TPD), ampliando la capacidad total del complejo beneficiador a 1,400 TPD y permitiendo atender la creciente demanda del sector artesanal.',
      icono: '🏭',
      lado: 'derecha'
    },
    {
      ano: '2017',
      titulo: 'Programa de Reprocesamiento de Relaves',
      descripcion: 'Implementación de un circuito especializado para el tratamiento de relaves históricos del sector. El sistema permite recuperar el oro residual de materiales previamente depositados, contribuyendo a la remediación ambiental de la zona.',
      icono: '♻️',
      lado: 'izquierda'
    },
    {
      ano: '2019',
      titulo: 'Renovación de Licencia Ambiental',
      descripcion: 'Actualización de la Licencia Ambiental del Ministerio del Ambiente, incorporando un Plan de Manejo Ambiental con estándares internacionales de gestión de relaves, uso responsable del cianuro y monitoreo continuo de aguas.',
      icono: '🌿',
      lado: 'derecha'
    },
    {
      ano: '2022',
      titulo: 'Modernización del Laboratorio Metalúrgico',
      descripcion: 'Implementación de un laboratorio metalúrgico de última generación en sitio, con equipos de análisis de ley, caracterización mineralógica y control de procesos en tiempo real para optimizar la recuperación y el control de calidad.',
      icono: '🔬',
      lado: 'izquierda'
    },
    {
      ano: '2024',
      titulo: 'Optimización Operacional',
      descripcion: 'Implementación de mejoras en los circuitos de concentración gravimétrica y flotación, elevando la recuperación promedio al 88% y reduciendo el consumo de reactivos por tonelada procesada.',
      icono: '📈',
      lado: 'derecha'
    },
    {
      ano: '2026+',
      titulo: 'Expansión y Sostenibilidad',
      descripcion: 'Comprometidos con la expansión responsable de la capacidad de procesamiento y la implementación de tecnologías más limpias para el beneficio de minerales, alineados con estándares internacionales.',
      icono: '🌱',
      lado: 'izquierda'
    }
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

if (!this.heroImage && allImages.length > 0) {
  this.heroImage = allImages[0];
}
        
        this.historyImages = allImages.slice(0, 4);
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
    return this.cloudinaryService.getCardUrl(image.publicId, 600);
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