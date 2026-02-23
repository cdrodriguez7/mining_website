import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { CloudinaryImage } from '../../core/models/gallery.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Imágenes dinámicas para el hero
  heroBackground: CloudinaryImage | null = null;
  
  // Imagen para sección about
  aboutImage: CloudinaryImage | null = null;
  
  // Imágenes para la galería (3 imágenes)
  galleryImages: CloudinaryImage[] = [];

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    console.log('🖼️ Cargando imágenes dinámicas para Home...');
    
    // Hero: Imagen landscape de infraestructura o maquinaria
    this.heroBackground = this.galleryService.getRandomLandscapeImage('infraestructura') 
      || this.galleryService.getRandomLandscapeImage('maquinaria');
    
    // About: Imagen de procesamiento o extracción
    this.aboutImage = this.galleryService.getRandomImageFromFolder('procesamiento')
      || this.galleryService.getRandomImageFromFolder('extraccion');
    
    // Galería: 3 imágenes aleatorias de diferentes carpetas
    const img1 = this.galleryService.getRandomImageFromFolder('extraccion');
    const img2 = this.galleryService.getRandomImageFromFolder('maquinaria');
    const img3 = this.galleryService.getRandomImageFromFolder('seguridad');
    
    this.galleryImages = [img1, img2, img3].filter(img => img !== null) as CloudinaryImage[];
    
    // Si no hay suficientes imágenes, rellenar con aleatorias
    if (this.galleryImages.length < 3) {
      const allImages = this.galleryService.getRecentImages(3);
      this.galleryImages = allImages.slice(0, 3);
    }
    
    console.log('✅ Imágenes cargadas para Home');
  }

  // Obtener URL hero (1920x1080)
  getHeroUrl(image: CloudinaryImage | null): string {
    if (!image) return 'https://i0.wp.com/fiduvalor.com.ec/wp-content/uploads/2023/05/mineria-ecuador-imagen-previa.jpg?fit=768%2C438&ssl=1';
    return this.cloudinaryService.getHeroUrl(image.publicId, 1920);
  }

  // Obtener URL para about (800x600)
  getAboutUrl(image: CloudinaryImage | null): string {
    if (!image) return 'https://www.minergiaec.com/wp-content/uploads/mineria-desarrollo-social-economico-ecuador-1024x576.jpg';
    return this.cloudinaryService.getResponsiveUrl(image.publicId, 800, 600);
  }

  // Obtener URL para galería (600x400)
  getGalleryUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getResponsiveUrl(image.publicId, 600, 400);
  }
}