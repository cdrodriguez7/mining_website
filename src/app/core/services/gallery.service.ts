import { Injectable } from '@angular/core';
import { CloudinaryImage, GalleryFolder, GALLERY_FOLDERS, SECTION_FOLDERS, SectionFolder } from '../models/gallery.model';
import { CloudinaryBackendService } from './cloudinary-backend.service';

// Cache en sessionStorage: persiste durante la sesión (navegación interna),
// pero se borra automáticamente con F5 o al cerrar la pestaña.
// Esto garantiza que las imágenes se recargan desde Cloudinary en cada visita nueva.
const STORAGE_PREFIX = 'plampromin_gallery_v1_';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private allImages: CloudinaryImage[] = [];

  constructor(private backendService: CloudinaryBackendService) {}

  /**
   * GALERÍA: carga TODAS las imágenes bajo mineria/ (todos los subfolderes).
   * Siempre consulta Cloudinary directamente — sin cache — para que las
   * imágenes subidas desde el dashboard de Cloudinary aparezcan de inmediato.
   */
  async initialize(): Promise<void> {
    try {
      console.log('[Gallery] Cargando TODAS las imágenes (galería)...');
      const images = await this.backendService.listResourcesByFolder(SECTION_FOLDERS.ALL);
      this.allImages = this.removeDuplicates(images);
      this.writeSession(SECTION_FOLDERS.ALL, this.allImages);
      console.log(`[Gallery] Total: ${this.allImages.length} imágenes en galería`);
    } catch (error) {
      console.error('[Gallery] Error cargando galería:', error);
      this.allImages = [];
    }
  }

  /**
   * SECCIONES: carga imágenes de la carpeta específica de una sección.
   * Usa sessionStorage para no repetir llamadas durante la misma sesión.
   * F5 o cerrar la pestaña siempre provoca una nueva llamada a Cloudinary.
   * Si la carpeta tiene menos de minCount imágenes y useFallback=true, cae a mineria/.
   */
  async initializeForSection(
    sectionFolder: SectionFolder,
    minCount: number = 3,
    useFallback: boolean = true
  ): Promise<void> {
    const cached = this.readSession(sectionFolder);
    if (cached) {
      console.log(`[Gallery] Cache sessionStorage hit: ${sectionFolder}`);
      this.allImages = cached;
      return;
    }

    try {
      console.log(`[Gallery] Cargando sección: ${sectionFolder}`);
      let images = await this.backendService.listResourcesByFolder(sectionFolder);
      images = this.removeDuplicates(images);

      if (useFallback && images.length < minCount) {
        console.warn(`[Gallery] ${sectionFolder} tiene ${images.length} imgs — fallback a mineria/`);
        const fallback = await this.backendService.listResourcesByFolder(SECTION_FOLDERS.ALL);
        images = this.removeDuplicates([...images, ...fallback]);
      }

      this.allImages = images;
      this.writeSession(sectionFolder, images);
      console.log(`[Gallery] ${sectionFolder}: ${images.length} imágenes`);
    } catch (error) {
      console.error(`[Gallery] Error en ${sectionFolder}:`, error);
      this.allImages = [];
    }
  }

  /**
   * GENÉRICO: devuelve imágenes de cualquier sección sin modificar allImages.
   * Útil para cargar imágenes secundarias (fondos, tarjetas de servicio, etc.)
   */
  async getImagesForSection(sectionFolder: SectionFolder): Promise<CloudinaryImage[]> {
    const cached = this.readSession(sectionFolder);
    if (cached) return cached;

    try {
      const images = this.removeDuplicates(
        await this.backendService.listResourcesByFolder(sectionFolder)
      );
      this.writeSession(sectionFolder, images);
      return images;
    } catch {
      return [];
    }
  }

  /**
   * NOTICIAS: carga imágenes de mineria/noticias para usar como fallback
   * en tarjetas de noticias que no tengan imagen propia del RSS.
   */
  async getNoticiasImages(): Promise<CloudinaryImage[]> {
    const cached = this.readSession(SECTION_FOLDERS.NOTICIAS);
    if (cached) return cached;

    try {
      const images = this.removeDuplicates(
        await this.backendService.listResourcesByFolder(SECTION_FOLDERS.NOTICIAS)
      );
      this.writeSession(SECTION_FOLDERS.NOTICIAS, images);
      console.log(`[Gallery] noticias: ${images.length} imágenes de fallback`);
      return images;
    } catch {
      return [];
    }
  }

  private readSession(folder: string): CloudinaryImage[] | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_PREFIX + folder);
      if (!raw) return null;
      const parsed: CloudinaryImage[] = JSON.parse(raw);
      // Restaurar objetos Date serializados como string
      return parsed.map(img => ({ ...img, createdAt: new Date(img.createdAt) }));
    } catch { return null; }
  }

  private writeSession(folder: string, images: CloudinaryImage[]): void {
    try {
      sessionStorage.setItem(STORAGE_PREFIX + folder, JSON.stringify(images));
    } catch { }
  }

  private removeDuplicates(images: CloudinaryImage[]): CloudinaryImage[] {
    const seen = new Map<string, CloudinaryImage>();
    images.forEach(img => {
      if (!seen.has(img.publicId)) seen.set(img.publicId, img);
    });
    return Array.from(seen.values());
  }

  getAllImages(): CloudinaryImage[] {
    return [...this.allImages];
  }

  getImagesByFolder(folderName: string): CloudinaryImage[] {
    if (folderName === 'all') return this.getAllImages();
    return this.allImages.filter(img => img.folder === folderName);
  }

  getFolders(): GalleryFolder[] {
    return GALLERY_FOLDERS;
  }

  async reload(): Promise<void> {
    // Borra todas las entradas de galería del sessionStorage
    Object.keys(sessionStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => sessionStorage.removeItem(k));
    this.allImages = [];
    console.log('[Gallery] Cache limpiado. Recargando galería...');
    await this.initialize();
  }
}
