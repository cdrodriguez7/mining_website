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

  subtitulo = 'Construyendo una Empresa Minera Líder';

  // Timeline de hitos históricos
  hitos: HitoHistorico[] = [
    {
      ano: '2006',
      titulo: 'Descubrimiento',
      descripcion: 'Descubrimiento del yacimiento aurífero en Camilo Ponce Enríquez. Primeros estudios geológicos identifican potencial significativo.',
      icono: '⛏️',
      lado: 'derecha'
    },
    {
      ano: '2007',
      titulo: 'Programa Inicial de Perforación',
      descripcion: 'Tercer pozo de un programa de perforación de tres pozos intersecta un promedio de 4.14 g/t de oro y 8.5 g/t de plata en 237.3m.',
      icono: '🔨',
      lado: 'izquierda'
    },
    {
      ano: '2008',
      titulo: 'Estimación Inicial de Recursos Minerales Inferidos',
      descripcion: 'Primera estimación de recursos publicada a finales de 2007, consistente en 58.9 Mt con ley de 7.23 g/t oro y 11.8 g/t plata, con ley de corte de 2.3 g/t oro-equivalente.',
      icono: '📄',
      lado: 'derecha'
    },
    {
      ano: '2008-2014',
      titulo: 'Adquisición del Proyecto',
      descripcion: 'PLAMPROMIN S.A. adquiere los activos en 2008 por aproximadamente USD 1.2 mil millones, consolidando la propiedad 100%.',
      icono: '💰',
      lado: 'izquierda'
    },
    {
      ano: '2010-2012',
      titulo: 'Perforación Adicional y Actualización de Recursos',
      descripcion: 'Programas extensivos de perforación confirman y expanden los recursos minerales. Actualización del modelo geológico.',
      icono: '🔨',
      lado: 'derecha'
    },
    {
      ano: '2013',
      titulo: 'Estudio de Prefactibilidad (PFS)',
      descripcion: 'Completado el Estudio de Prefactibilidad que demuestra la viabilidad técnica y económica del proyecto subterráneo.',
      icono: '📊',
      lado: 'izquierda'
    },
    {
      ano: '2015',
      titulo: 'Estudio de Factibilidad (FS)',
      descripcion: 'Estudio de Factibilidad completo confirma proyecto subterráneo con vida útil de 12 años y producción promedio de 500,000 oz/año.',
      icono: '✅',
      lado: 'derecha'
    },
    {
      ano: '2016-2017',
      titulo: 'Licencias y Permisos',
      descripcion: 'Obtención de Licencia Ambiental del Ministerio del Ambiente y permisos clave de ARCOM, SENAGUA y autoridades locales.',
      icono: '📋',
      lado: 'izquierda'
    },
    {
      ano: '2018',
      titulo: 'Inicio de Construcción',
      descripcion: 'Comienzo oficial de la fase de construcción. Desarrollo de infraestructura superficial y preparación de accesos subterráneos.',
      icono: '🏗️',
      lado: 'derecha'
    },
    {
      ano: '2019-2020',
      titulo: 'Desarrollo Subterráneo',
      descripcion: 'Avance acelerado en el desarrollo de túneles, rampas y preparación de zonas de extracción. Construcción de planta de procesamiento.',
      icono: '⚙️',
      lado: 'izquierda'
    },
    {
      ano: '2021',
      titulo: 'Primera Producción Comercial',
      descripcion: 'Inicio de operaciones comerciales. Primera barra de oro producida. Ramp-up gradual hacia capacidad nominal.',
      icono: '🥇',
      lado: 'derecha'
    },
    {
      ano: '2022-2023',
      titulo: 'Optimización Operacional',
      descripcion: 'Alcance de capacidad nominal de diseño. Implementación de mejoras continuas en procesos de extracción y procesamiento.',
      icono: '📈',
      lado: 'izquierda'
    },
    {
      ano: '2024',
      titulo: 'Certificaciones Internacionales',
      descripcion: 'Obtención de certificaciones ISO 14001, ISO 45001 e ISO 9001. Certificación del Código Internacional de Manejo del Cianuro.',
      icono: '🏆',
      lado: 'derecha'
    },
    {
      ano: '2025',
      titulo: 'Exploración de Expansión',
      descripcion: 'Programas de exploración regional identifican nuevos objetivos. Estudios preliminares para potencial extensión de vida útil.',
      icono: '🔍',
      lado: 'izquierda'
    },
    {
      ano: '2026+',
      titulo: 'Futuro Sostenible',
      descripcion: 'Compromiso con operación responsable, generación de valor para stakeholders y contribución al desarrollo sostenible del Ecuador.',
      icono: '🌱',
      lado: 'derecha'
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