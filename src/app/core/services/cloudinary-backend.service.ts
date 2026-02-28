import { Injectable } from '@angular/core';
import { CloudinaryImage } from '../models/gallery.model';

interface ApiResponse {
  success: boolean;
  folder: string;
  count: number;
  images: any[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryBackendService {
  private readonly API_BASE = '';

  constructor() {
    console.log('Estableciendo conexion con Cloudinary');
  }

  async listResourcesByFolder(folder: string): Promise<CloudinaryImage[]> {
    try {
      console.log(`Solicitando img: ${folder}`);
      
      const timestamp = Date.now();
      const url = `${this.API_BASE}/api/images?folder=${encodeURIComponent(folder)}&t=${timestamp}`;
      
      console.log('URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        console.error('API retorno error:', data.error);
        throw new Error(data.error || 'Error desconocido');
      }

      console.log(`${data.count} imagenes de ${folder}`);
      
      return data.images.map(img => ({
        publicId: img.publicId,
        title: img.title,
        description: img.description,
        folder: img.folder,
        tags: img.tags,
        width: img.width,
        height: img.height,
        format: img.format,
        createdAt: new Date(img.createdAt),
        secureUrl: img.secureUrl
      }));
      
    } catch (error: any) {
      console.error(`Error listando ${folder}:`, error);
      return [];
    }
  }

  async listResourcesByFolders(folders: string[]): Promise<CloudinaryImage[]> {
    console.log(`Procesando ${folders.length} carpetas:`, folders);
    
    const promises = folders.map(folder => this.listResourcesByFolder(folder));
    const results = await Promise.all(promises);
    
    const allImages = results.flat();
    console.log(`Total final: ${allImages.length} imagenes`);
    
    return allImages;
  }
}