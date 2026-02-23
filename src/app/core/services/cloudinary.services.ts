import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale, fit, crop } from '@cloudinary/url-gen/actions/resize';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { environment } from '../../../environments/environment';

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: Cloudinary;
  private readonly API_URL: string;

  constructor() {
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: environment.cloudinary.cloudName
      }
    });

    this.API_URL = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;
  }

  /**
   * Obtener URL optimizada de imagen
   */
  getImageUrl(publicId: string, options?: TransformOptions): string {
    const image = this.cloudinary.image(publicId);
    
    if (options?.width || options?.height) {
      const w = options.width || 0;
      const h = options.height || 0;
      
      switch (options.crop) {
        case 'fill':
          image.resize(fill().width(w).height(h));
          break;
        case 'fit':
          image.resize(fit().width(w).height(h));
          break;
        case 'scale':
          image.resize(scale().width(w).height(h));
          break;
        case 'crop':
          image.resize(crop().width(w).height(h));
          break;
        default:
          image.resize(fill().width(w).height(h));
      }
    }

    // Optimizaciones
    image.quality(options?.quality || auto());
    
    return image.toURL();
  }

  /**
   * Obtener URL para dimensiones específicas (responsive)
   */
  getResponsiveUrl(publicId: string, width: number, height: number): string {
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }

  /**
   * Obtener thumbnail
   */
  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill'
    });
  }

  /**
   * Obtener URL optimizada para hero/banner (16:9)
   */
  getHeroUrl(publicId: string, width: number = 1600): string {
    const height = Math.round(width * 9 / 16); // Aspect ratio 16:9
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto'
    });
  }

  /**
   * Obtener URL para card/thumbnail (4:3)
   */
  getCardUrl(publicId: string, width: number = 400): string {
    const height = Math.round(width * 3 / 4); // Aspect ratio 4:3
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill'
    });
  }

  /**
   * Subir imagen
   */
  uploadImage(
    file: File,
    folder?: string,
    onProgress?: (progress: number) => void
  ): Promise<CloudinaryUploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloudinary.uploadPreset);
      
      if (folder) {
        formData.append('folder', folder);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Error al procesar la respuesta de Cloudinary'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error?.message || `Error ${xhr.status}`));
          } catch {
            reject(new Error(`Error HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Error de conexión'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout'));
      });

      xhr.timeout = 30000;
      xhr.open('POST', this.API_URL);
      xhr.send(formData);
    });
  }
}

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