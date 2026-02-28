import { Injectable } from '@angular/core';
import { CloudinaryImage } from '../models/gallery.model';

export type AspectRatioType = 'landscape' | 'portrait' | 'square' | 'ultrawide' | 'any';

export interface ImageRequirements {
  aspectRatio: AspectRatioType;
  minWidth?: number;
  minHeight?: number;
  folder?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageSelectorService {
  
  constructor() {}

  /**
   * Selecciona una imagen aleatoria que cumpla con los requisitos
   */
  selectImage(
    images: CloudinaryImage[], 
    requirements: ImageRequirements
  ): CloudinaryImage | null {
    
    // Filtrar imágenes por carpeta si se especifica
    let filtered = [...images];
    
    if (requirements.folder) {
      filtered = filtered.filter(img => img.folder === requirements.folder);
    }

    // Filtrar por tags si se especifica
    if (requirements.tags && requirements.tags.length > 0) {
      filtered = filtered.filter(img => 
        requirements.tags!.some(tag => img.tags.includes(tag))
      );
    }

    // Filtrar por dimensiones mínimas
    if (requirements.minWidth) {
      filtered = filtered.filter(img => img.width >= requirements.minWidth!);
    }

    if (requirements.minHeight) {
      filtered = filtered.filter(img => img.height >= requirements.minHeight!);
    }

    // Filtrar por aspect ratio
    filtered = this.filterByAspectRatio(filtered, requirements.aspectRatio);

    if (filtered.length === 0) {
      console.warn('⚠️ No se encontraron imágenes que cumplan los requisitos:', requirements);
      return null;
    }

    // Seleccionar aleatoriamente
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selected = filtered[randomIndex];

    console.log(`✅ Imagen seleccionada para ${requirements.aspectRatio}:`, selected.publicId);
    
    return selected;
  }

  /**
   * Selecciona múltiples imágenes diferentes
   */
  selectImages(
    images: CloudinaryImage[],
    requirements: ImageRequirements,
    count: number
  ): CloudinaryImage[] {
    const selected: CloudinaryImage[] = [];
    const available = [...images];

    for (let i = 0; i < count && available.length > 0; i++) {
      const img = this.selectImage(available, requirements);
      
      if (img) {
        selected.push(img);
        // Remover de disponibles para evitar duplicados
        const index = available.findIndex(a => a.publicId === img.publicId);
        if (index > -1) {
          available.splice(index, 1);
        }
      }
    }

    return selected;
  }

  /**
   * Filtrar imágenes por aspect ratio
   */
  private filterByAspectRatio(
    images: CloudinaryImage[],
    aspectRatio: AspectRatioType
  ): CloudinaryImage[] {
    
    return images.filter(img => {
      const ratio = img.width / img.height;
      
      switch (aspectRatio) {
        case 'landscape':
          // Horizontal: ratio > 1.3 (ej: 16:9, 4:3)
          return ratio >= 1.3;
          
        case 'portrait':
          // Vertical: ratio < 0.8 (ej: 9:16, 2:3)
          return ratio <= 0.8;
          
        case 'square':
          // Cuadrado: ratio entre 0.9 y 1.1 (ej: 1:1)
          return ratio >= 0.9 && ratio <= 1.1;
          
        case 'ultrawide':
          // Ultra ancho: ratio > 2 (ej: 21:9, 32:9)
          return ratio >= 2.0;
          
        case 'any':
          return true;
          
        default:
          return true;
      }
    });
  }

  /**
   * Obtener el aspect ratio de una imagen
   */
  getAspectRatio(image: CloudinaryImage): AspectRatioType {
    const ratio = image.width / image.height;
    
    if (ratio >= 2.0) return 'ultrawide';
    if (ratio >= 1.3) return 'landscape';
    if (ratio <= 0.8) return 'portrait';
    if (ratio >= 0.9 && ratio <= 1.1) return 'square';
    
    return 'any';
  }

  /**
   * Agrupar imágenes por aspect ratio
   */
  groupByAspectRatio(images: CloudinaryImage[]): {
    landscape: CloudinaryImage[];
    portrait: CloudinaryImage[];
    square: CloudinaryImage[];
    ultrawide: CloudinaryImage[];
  } {
    return {
      landscape: this.filterByAspectRatio(images, 'landscape'),
      portrait: this.filterByAspectRatio(images, 'portrait'),
      square: this.filterByAspectRatio(images, 'square'),
      ultrawide: this.filterByAspectRatio(images, 'ultrawide')
    };
  }
}