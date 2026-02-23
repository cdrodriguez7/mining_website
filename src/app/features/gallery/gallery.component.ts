import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { CloudinaryImage, GalleryFolder } from '../../core/models/gallery.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  allImages: CloudinaryImage[] = [];
  filteredImages: CloudinaryImage[] = [];
  folders: GalleryFolder[] = [];
  selectedFolder: string = 'all';
  
  // Para localStorage
  uploadedImages: CloudinaryImage[] = [];

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    console.log('📂 Cargando galería completa...');
    
    // Cargar carpetas disponibles
    this.folders = this.galleryService.getFolders();
    
    // Cargar todas las imágenes de Cloudinary
    const cloudinaryImages = this.galleryService.getAllImages();
    
    // Cargar imágenes subidas vía upload (localStorage)
    this.uploadedImages = this.getUploadedImages();
    
    // Combinar ambas
    this.allImages = [...this.uploadedImages, ...cloudinaryImages];
    this.filteredImages = [...this.allImages];
    
    console.log(`✅ Total: ${this.allImages.length} imágenes`);
    console.log(`  - Desde Cloudinary: ${cloudinaryImages.length}`);
    console.log(`  - Subidas vía upload: ${this.uploadedImages.length}`);
  }

  getUploadedImages(): CloudinaryImage[] {
    try {
      const stored = localStorage.getItem('cloudinary_uploaded_images');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir al formato CloudinaryImage
        return parsed.map((img: any) => ({
          publicId: img.publicId,
          title: img.title,
          description: img.description,
          folder: 'uploads', // Carpeta especial para uploads
          tags: img.tags || [],
          width: 1920,
          height: 1080,
          format: 'jpg',
          createdAt: new Date(img.uploadedAt),
          secureUrl: ''
        }));
      }
    } catch (error) {
      console.error('Error al cargar imágenes de localStorage:', error);
    }
    return [];
  }

  filterByFolder(folderName: string) {
    this.selectedFolder = folderName;
    
    if (folderName === 'all') {
      this.filteredImages = [...this.allImages];
    } else {
      this.filteredImages = this.allImages.filter(img => img.folder === folderName);
    }
    
    console.log(`🔍 Filtrado por: ${folderName} - ${this.filteredImages.length} imágenes`);
  }

  getImageUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 400);
  }

  getThumbnailUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getThumbnailUrl(image.publicId, 200);
  }
}