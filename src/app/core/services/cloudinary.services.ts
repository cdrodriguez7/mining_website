import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: Cloudinary;

  constructor() {
    // Inicializar Cloudinary directamente
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: environment.cloudinary.cloudName
      }
    });
  }

  /**
   * Obtener URL de imagen optimizada
   * @param publicId - ID público de la imagen en Cloudinary
   * @param width - Ancho deseado (opcional)
   * @param height - Alto deseado (opcional)
   */
    getImageUrl(publicId: string, width?: number, height?: number): string {
      const image = this.cloudinary.image(publicId);
      
      if (width && height) {
        image.resize(fill().width(width).height(height));
      } else if (width) {
        image.resize(fill().width(width));
      }
    // Optimizaciones automáticas
    image.quality(auto());
    
    return image.toURL();
  }

  /**
   * Subir imagen a Cloudinary
   * @param file - Archivo a subir
   * @param folder - Carpeta destino (opcional)
   */
  async uploadImage(file: File, folder?: string): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al subir la imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }

  /**
   * Generar thumbnail
      */
    getThumbnailUrl(publicId: string, size: number = 200): string {
      return this.cloudinary
        .image(publicId)
        .resize(fill().width(size).height(size))
        .quality(auto())
        .toURL();
    }
}

// Interface para la respuesta de Cloudinary
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  original_filename?: string;
  folder?: string;
}