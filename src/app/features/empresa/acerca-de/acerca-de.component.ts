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

interface Statistic {
  icon: string;
  value: string;
  label: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ImagePreviewComponent
  ],
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss']
})
export class AcercaDeComponent implements OnInit {
  isLoading = true;
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  heroImage: CloudinaryImage | null = null;
  aboutImage: CloudinaryImage | null = null;

  statistics: Statistic[] = [
    {
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      value: '82',
      label: 'Concesiones Activas'
    },
    {
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      value: '72%',
      label: 'Producción Nacional de Oro'
    },
    {
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      value: '25+',
      label: 'Años de Experiencia'
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      value: '123+',
      label: 'Trabajadores Activos'
    }
  ];

  valores: Value[] = [
    {
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      title: 'Transparencia',
      description: 'Rendición de cuentas clara sobre operaciones, inversiones sociales y desempeño ambiental.'
    },
    {
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      title: 'Legalidad',
      description: 'Cumplimiento estricto de la normativa minera, ambiental y laboral ecuatoriana vigente.'
    },
    {
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Sostenibilidad',
      description: 'Desarrollo económico en equilibrio con la protección del medio ambiente y los ecosistemas locales.'
    },
    {
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      title: 'Responsabilidad Social',
      description: 'Compromiso activo con el bienestar de las 8 comunidades del área de influencia de Camilo Ponce Enríquez.'
    }
  ];

  hitos = [
    { anio: '1998', evento: 'Constitución de PLAMPROMIN S.A. en Quito, Ecuador' },
    { anio: '2003', evento: 'Obtención de primeras concesiones en el cantón Ponce Enríquez' },
    { anio: '2010', evento: 'Ampliación de operaciones: planta de beneficio y sistema de relaves' },
    { anio: '2015', evento: 'Certificación ISO 14001 e implementación del Plan de Manejo Ambiental' },
    { anio: '2019', evento: 'Aprobación del EIA por el MAATE y actualización del Plan QHSE' },
    { anio: '2024', evento: 'Récord de producción responsable y 0 fatalidades por tercer año consecutivo' },
  ];

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService,
    private imageSelectorService: ImageSelectorService
  ) {}

  async ngOnInit() {
    await this.loadDynamicImages();
  }

  async loadDynamicImages() {
    try {
      this.isLoading = true;
      console.log('[Acerca De] Cargando imagenes dinamicas...');

      await this.galleryService.initializeForSection(SECTION_FOLDERS.EMPRESA);
      let allImages = this.galleryService.getAllImages();

      console.log('[Acerca De] Imagenes disponibles:', allImages.length);

      if (allImages.length === 0) {
        console.warn('[Acerca De] No hay imagenes disponibles');
        this.isLoading = false;
        return;
      }

      this.selectImages(allImages);

      this.isLoading = false;
      console.log('[Acerca De] Imagenes dinamicas cargadas');

    } catch (error) {
      console.error('[Acerca De] Error cargando imagenes:', error);
      this.isLoading = false;
    }
  }

  private selectImages(allImages: CloudinaryImage[]) {
    console.log('[Acerca De] Seleccionando imagenes de', allImages.length, 'disponibles');

    this.heroImage = this.imageSelectorService.selectImage(allImages, {
      aspectRatio: 'landscape',
      minWidth: 1200
    });

    if (!this.heroImage && allImages.length > 0) {
      this.heroImage = allImages[0];
      console.log('[Acerca De] No hay landscape para hero, usando primera imagen');
    }

    console.log('[Acerca De] Hero image:', this.heroImage?.publicId);

    this.aboutImage = this.imageSelectorService.selectImage(allImages, {
      aspectRatio: 'landscape',
      minWidth: 800
    });

    if (!this.aboutImage && allImages.length > 1) {
      this.aboutImage = allImages.find(img => img.publicId !== this.heroImage?.publicId) || allImages[1];
      console.log('[Acerca De] Usando segunda imagen para about');
    } else if (!this.aboutImage && allImages.length === 1) {
      this.aboutImage = allImages[0];
    }

    console.log('[Acerca De] About image:', this.aboutImage?.publicId);
  }

  getHeroImageUrl(): string {
    if (!this.heroImage) return '';
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getAboutImageUrl(): string {
    if (!this.aboutImage) return '';
    return this.cloudinaryService.getResponsiveUrl(this.aboutImage.publicId, 1200, 800);
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