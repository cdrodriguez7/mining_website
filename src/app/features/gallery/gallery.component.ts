import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../core/services/cloudinary.services';

interface GalleryImage {
  publicId: string;
  title: string;
  description: string;
  tags?: string[];
  uploadedAt?: Date;
}


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  allImages: GalleryImage[] = [];
  
  // Imágenes de ejemplo (Cloudinary samples)
  sampleImages: GalleryImage[] = [
    {
      publicId: 'samples/landscapes/beach-boat',
      title: 'Playa Ejemplo',
      description: 'Imagen de ejemplo de Cloudinary',
      tags: ['ejemplo', 'playa']
    },
    {
      publicId: 'samples/landscapes/nature-mountains',
      title: 'Montañas Ejemplo',
      description: 'Imagen de ejemplo de Cloudinary',
      tags: ['ejemplo', 'montaña']
    },
    {
      publicId: 'samples/ecommerce/accessories-bag',
      title: 'Accesorios Ejemplo',
      description: 'Imagen de ejemplo de Cloudinary',
      tags: ['ejemplo']
    }
  ];

  constructor(private cloudinaryService: CloudinaryService) {}

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    // Cargar imágenes subidas desde localStorage
    const uploadedImages = this.getUploadedImages();
    
    // Combinar imágenes de ejemplo con las subidas
    this.allImages = [...uploadedImages, ...this.sampleImages];
    
    console.log('Galería cargada:', this.allImages);
  }

  getUploadedImages(): GalleryImage[] {
    try {
      const stored = localStorage.getItem('cloudinary_uploaded_images');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    }
    return [];
  }

  getImageUrl(publicId: string): string {
    return this.cloudinaryService.getImageUrl(publicId, 400, 300);
  }

  getThumbnailUrl(publicId: string): string {
    return this.cloudinaryService.getThumbnailUrl(publicId, 200);
  }


  refreshGallery() {
    this.loadGallery();
  }
}