import { Injectable } from '@angular/core';
import { CloudinaryImage, GalleryFolder, GALLERY_FOLDERS, ImageDimensions } from '../models/gallery.model';

/**
 * IMPORTANTE: Este servicio usa datos hardcodeados de las imágenes.
 * En producción, estos datos vendrían de tu backend que consulta la API de Cloudinary.
 * 
 * Por ahora, debes mantener esta lista actualizada manualmente.
 */

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  // 📌 LISTA MAESTRA DE IMÁGENES
  // Actualiza esta lista con las imágenes que subes a Cloudinary
  private allImages: CloudinaryImage[] = [
    // ===== MAQUINARIA =====
    {
      publicId: 'mineria/maquinaria/excavadora-caterpillar',
      title: 'Excavadora Caterpillar 336',
      description: 'Excavadora de alta capacidad en operación',
      folder: 'maquinaria',
      tags: ['excavadora', 'caterpillar', 'maquinaria-pesada'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-01-15'),
      secureUrl: ''
    },
    {
      publicId: 'mineria/maquinaria/camion-volquete',
      title: 'Camión Volquete',
      description: 'Transporte de material extraído',
      folder: 'maquinaria',
      tags: ['camion', 'transporte'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-01-16'),
      secureUrl: ''
    },

    // ===== INFRAESTRUCTURA =====
    {
      publicId: 'mineria/infraestructura/planta-procesamiento',
      title: 'Planta de Procesamiento',
      description: 'Instalaciones de procesamiento mineral',
      folder: 'infraestructura',
      tags: ['planta', 'procesamiento', 'instalaciones'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-01-20'),
      secureUrl: ''
    },
    {
      publicId: 'mineria/infraestructura/oficinas-administrativas',
      title: 'Oficinas Administrativas',
      description: 'Centro administrativo y de operaciones',
      folder: 'infraestructura',
      tags: ['oficinas', 'administracion'],
      width: 1600,
      height: 900,
      format: 'jpg',
      createdAt: new Date('2024-01-21'),
      secureUrl: ''
    },
    {
      publicId: 'mineria/infraestructura/campamento-trabajadores',
      title: 'Campamento de Trabajadores',
      description: 'Alojamiento para personal operativo',
      folder: 'infraestructura',
      tags: ['campamento', 'alojamiento'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-01-22'),
      secureUrl: ''
    },

    // ===== EXTRACCIÓN =====
    {
      publicId: 'mineria/extraccion/perforacion-profunda',
      title: 'Perforación en Profundidad',
      description: 'Operaciones de perforación a 500m',
      folder: 'extraccion',
      tags: ['perforacion', 'extraccion'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-02-01'),
      secureUrl: ''
    },
    {
      publicId: 'mineria/extraccion/voladura-controlada',
      title: 'Voladura Controlada',
      description: 'Proceso de voladura supervisada',
      folder: 'extraccion',
      tags: ['voladura', 'explosivos'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-02-02'),
      secureUrl: ''
    },

    // ===== PROCESAMIENTO =====
    {
      publicId: 'mineria/procesamiento/molino-bolas',
      title: 'Molino de Bolas',
      description: 'Trituración y molienda de mineral',
      folder: 'procesamiento',
      tags: ['molino', 'trituracion'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-02-10'),
      secureUrl: ''
    },

    // ===== SEGURIDAD =====
    {
      publicId: 'mineria/seguridad/equipo-proteccion',
      title: 'Equipo de Protección Personal',
      description: 'EPP requerido para operaciones',
      folder: 'seguridad',
      tags: ['epp', 'seguridad'],
      width: 1200,
      height: 800,
      format: 'jpg',
      createdAt: new Date('2024-02-15'),
      secureUrl: ''
    },

    // ===== MEDIO AMBIENTE =====
    {
      publicId: 'mineria/medio-ambiente/reforestacion',
      title: 'Programa de Reforestación',
      description: 'Iniciativa de sostenibilidad ambiental',
      folder: 'medio-ambiente',
      tags: ['sostenibilidad', 'reforestacion'],
      width: 1920,
      height: 1080,
      format: 'jpg',
      createdAt: new Date('2024-02-20'),
      secureUrl: ''
    }
  ];

  constructor() {}

  /**
   * Obtener todas las imágenes
   */
  getAllImages(): CloudinaryImage[] {
    return [...this.allImages];
  }

  /**
   * Obtener imágenes de una carpeta específica
   */
  getImagesByFolder(folderName: string): CloudinaryImage[] {
    return this.allImages.filter(img => img.folder === folderName);
  }

  /**
   * Obtener todas las carpetas disponibles
   */
  getFolders(): GalleryFolder[] {
    return GALLERY_FOLDERS;
  }

  /**
   * Obtener imagen aleatoria de una carpeta
   */
  getRandomImageFromFolder(folderName: string): CloudinaryImage | null {
    const images = this.getImagesByFolder(folderName);
    if (images.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  /**
   * Obtener imagen aleatoria que cumpla con dimensiones específicas
   */
  getRandomImageByDimensions(
    folderName: string,
    minWidth: number,
    minHeight: number
  ): CloudinaryImage | null {
    const images = this.getImagesByFolder(folderName)
      .filter(img => img.width >= minWidth && img.height >= minHeight);
    
    if (images.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  /**
   * Obtener imágenes por aspecto ratio
   */
  getImagesByAspectRatio(
    folderName: string,
    aspectRatio: 'landscape' | 'portrait' | 'square'
  ): CloudinaryImage[] {
    return this.getImagesByFolder(folderName).filter(img => {
      const ratio = img.width / img.height;
      
      switch (aspectRatio) {
        case 'landscape':
          return ratio > 1.2; // 16:9, 4:3, etc
        case 'portrait':
          return ratio < 0.8; // 9:16, 3:4, etc
        case 'square':
          return ratio >= 0.9 && ratio <= 1.1; // ~1:1
        default:
          return true;
      }
    });
  }

  /**
   * Obtener imagen aleatoria landscape (horizontal) de una carpeta
   */
  getRandomLandscapeImage(folderName: string): CloudinaryImage | null {
    const images = this.getImagesByAspectRatio(folderName, 'landscape');
    if (images.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  /**
   * Buscar imágenes por tags
   */
  searchByTags(tags: string[]): CloudinaryImage[] {
    return this.allImages.filter(img =>
      tags.some(tag => img.tags.includes(tag.toLowerCase()))
    );
  }

  /**
   * Obtener imágenes recientes
   */
  getRecentImages(limit: number = 10): CloudinaryImage[] {
    return [...this.allImages]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}