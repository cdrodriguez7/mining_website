import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage } from '../../../core/models/gallery.model';

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
    FooterComponent
  ],
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss']
})
export class AcercaDeComponent implements OnInit {
  isLoading = true;

  heroImage: CloudinaryImage | null = null;
  aboutImage: CloudinaryImage | null = null;

  statistics: Statistic[] = [
    {
      icon: '⛏️',
      value: '82',
      label: 'Concesiones Activas'
    },
    {
      icon: '🏆',
      value: '72%',
      label: 'Producción Nacional de Oro'
    },
    {
      icon: '📅',
      value: '25+',
      label: 'Años de Experiencia'
    },
    {
      icon: '👷',
      value: '123+',
      label: 'Trabajadores Activos'
    }
  ];

  valores: Value[] = [
    {
      icon: '🔍',
      title: 'Transparencia',
      description: 'Información clara y accesible sobre todas las operaciones mineras en la región.'
    },
    {
      icon: '⚖️',
      title: 'Legalidad',
      description: 'Cumplimiento estricto de todas las normativas mineras y ambientales vigentes.'
    },
    {
      icon: '🌱',
      title: 'Sostenibilidad',
      description: 'Desarrollo económico en armonía con la protección del medio ambiente.'
    },
    {
      icon: '🤝',
      title: 'Responsabilidad',
      description: 'Compromiso con el bienestar de las comunidades y el desarrollo regional.'
    }
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

      await this.galleryService.initialize();
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
    if (!this.heroImage) {
      return 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=2070';
    }
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getAboutImageUrl(): string {
    if (!this.aboutImage) {
      return 'https://images.unsplash.com/photo-1615485500834-bc10199bc255?q=80&w=2070';
    }
    return this.cloudinaryService.getResponsiveUrl(this.aboutImage.publicId, 1200, 800);
  }
}