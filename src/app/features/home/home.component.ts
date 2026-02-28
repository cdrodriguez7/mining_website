import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { ImageSelectorService } from '../../core/services/image-selector.service';
import { CloudinaryImage } from '../../core/models/gallery.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = true;

  // Imágenes dinámicas
  heroImage: CloudinaryImage | null = null;
  aboutImage: CloudinaryImage | null = null;
  galleryPreviewImages: CloudinaryImage[] = [];

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
      console.log('[Home] Cargando imágenes dinámicas...');

      // 1. Intentar cargar desde backend
      await this.galleryService.initialize();
      let allImages = this.galleryService.getAllImages();

      console.log('[Home] Imágenes desde backend:', allImages.length);

      // 2. Si no hay imágenes del backend, cargar desde localStorage
      if (allImages.length === 0) {
        console.log('[Home] No hay imágenes del backend, cargando desde localStorage...');
        allImages = this.getUploadedImages();
        console.log('[Home] Imágenes desde localStorage:', allImages.length);
      }

      // 3. Si aún no hay imágenes, mostrar mensaje
      if (allImages.length === 0) {
        console.warn('[Home] No hay imágenes disponibles');
        this.isLoading = false;
        return;
      }

      // 4. Seleccionar imágenes para cada sección
      this.selectImages(allImages);

      this.isLoading = false;
      console.log('[Home] Imágenes dinámicas cargadas');

    } catch (error) {
      console.error('[Home] Error cargando imágenes:', error);
      
      // Fallback: cargar desde localStorage
      console.log('[Home] Intentando fallback con localStorage...');
      const localImages = this.getUploadedImages();
      if (localImages.length > 0) {
        this.selectImages(localImages);
      }
      
      this.isLoading = false;
    }
  }

  private selectImages(allImages: CloudinaryImage[]) {
    console.log('[Home] Seleccionando imágenes de', allImages.length, 'disponibles');

    // Hero: Imagen landscape (horizontal)
    this.heroImage = this.imageSelectorService.selectImage(allImages, {
      aspectRatio: 'landscape',
      minWidth: 800
    });

    // Si no hay landscape, usar cualquiera
    if (!this.heroImage && allImages.length > 0) {
      this.heroImage = allImages[0];
      console.log('[Home] No hay landscape para hero, usando primera imagen');
    }

    console.log('[Home] Hero image:', this.heroImage?.publicId);

    // About: Imagen portrait o square
    this.aboutImage = this.imageSelectorService.selectImage(allImages, {
      aspectRatio: 'portrait'
    });

    // Si no hay portrait, usar square
    if (!this.aboutImage) {
      this.aboutImage = this.imageSelectorService.selectImage(allImages, {
        aspectRatio: 'square'
      });
    }

    // Si no hay ninguna, usar cualquiera excepto la del hero
    if (!this.aboutImage && allImages.length > 1) {
      this.aboutImage = allImages.find(img => img.publicId !== this.heroImage?.publicId) || allImages[1];
      console.log('[Home] No hay portrait/square para about, usando segunda imagen');
    }

    console.log('[Home] About image:', this.aboutImage?.publicId);

    // Gallery: Hasta 6 imágenes diferentes
    const usedIds = [this.heroImage?.publicId, this.aboutImage?.publicId].filter(Boolean);
    const availableForGallery = allImages.filter(img => !usedIds.includes(img.publicId));

    this.galleryPreviewImages = this.imageSelectorService.selectImages(
      availableForGallery.length > 0 ? availableForGallery : allImages,
      { aspectRatio: 'any' },
      6
    );

    console.log('[Home] Gallery images:', this.galleryPreviewImages.length);
  }

  // Obtener imágenes subidas desde localStorage
  private getUploadedImages(): CloudinaryImage[] {
    try {
      const stored = localStorage.getItem('uploadedImages');
      if (stored) {
        const images: CloudinaryImage[] = JSON.parse(stored);
        // Convertir strings de fecha a Date objects
        images.forEach(img => {
          img.createdAt = new Date(img.createdAt);
        });
        console.log('[Home] Cargadas', images.length, 'imágenes desde localStorage');
        return images;
      }
    } catch (error) {
      console.error('[Home] Error cargando desde localStorage:', error);
    }
    return [];
  }

  // URLs optimizadas de Cloudinary
  getHeroImageUrl(): string {
    if (!this.heroImage) return '';
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getAboutImageUrl(): string {
    if (!this.aboutImage) return '';
    return this.cloudinaryService.getResponsiveUrl(this.aboutImage.publicId, 800, 1000);
  }

  getGalleryPreviewUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 600);
  }
}
