import { Injectable } from '@angular/core';
import { CloudinaryImage, GalleryFolder, GALLERY_FOLDERS } from '../models/gallery.model';
import { CloudinaryBackendService } from './cloudinary-backend.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private allImages: CloudinaryImage[] = [];

  constructor(private backendService: CloudinaryBackendService) {}

  async initialize(): Promise<void> {
    try {
      console.log('Cargando imagenes desde backend (sin cache)...');
      
      const images = await this.backendService.listResourcesByFolder('mineria');
      
      this.allImages = this.removeDuplicates(images);
      
      console.log(`Total cargadas: ${this.allImages.length} imagenes`);
      console.log('Public IDs:', this.allImages.map(img => img.publicId));
      
    } catch (error) {
      console.error('Error:', error);
      this.allImages = [];
    }
  }

  private removeDuplicates(images: CloudinaryImage[]): CloudinaryImage[] {
    const seen = new Map<string, CloudinaryImage>();
    
    images.forEach(img => {
      if (!seen.has(img.publicId)) {
        seen.set(img.publicId, img);
      }
    });
    
    const duplicatesRemoved = images.length - seen.size;
    if (duplicatesRemoved > 0) {
      console.log(`Eliminados ${duplicatesRemoved} duplicados`);
    }
    
    return Array.from(seen.values());
  }

  getAllImages(): CloudinaryImage[] {
    return [...this.allImages];
  }

  getImagesByFolder(folderName: string): CloudinaryImage[] {
    if (folderName === 'all') {
      return this.getAllImages();
    }
    return this.allImages.filter(img => img.folder === folderName);
  }

  getFolders(): GalleryFolder[] {
    return GALLERY_FOLDERS;
  }

  async reload(): Promise<void> {
    console.log('Recargando galeria...');
    await this.initialize();
  }
}