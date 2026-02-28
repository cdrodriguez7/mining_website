import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale, fit, crop } from '@cloudinary/url-gen/actions/resize';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { environment } from '../../../environments/environment';

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: string;
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

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: Cloudinary;
  private readonly API_URL: string;
  private readonly CLOUD_NAME: string;

  constructor() {
    this.CLOUD_NAME = environment.cloudinary.cloudName;
    
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: this.CLOUD_NAME
      }
    });

    this.API_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;
    
    console.log('☁️ Cloudinary Service inicializado');
    console.log('📦 Cloud Name:', this.CLOUD_NAME);
  }

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

    image.quality(auto());
    
    return image.toURL();
  }

  getResponsiveUrl(publicId: string, width: number, height: number): string {
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto'
    });
  }

  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill'
    });
  }

  getHeroUrl(publicId: string, width: number = 1600): string {
    const height = Math.round(width * 9 / 16);
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto'
    });
  }

  getCardUrl(publicId: string, width: number = 400): string {
    const height = Math.round(width * 3 / 4);
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill'
    });
  }

  /**
   * Subir imagen a Cloudinary
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
      console.log('[Cloudinary Service] Guardando en carpeta:', folder);
      formData.append('folder', folder);
      
      formData.append('public_id', `${folder}/${Date.now()}`);
      }

      formData.append('timestamp', Date.now().toString());

      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });

      // Success
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log('✅ Upload exitoso:', response);
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

      // Error
      xhr.addEventListener('error', () => {
        reject(new Error('Error de conexión con Cloudinary'));
      });

      // Timeout
      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout al subir la imagen'));
      });

      xhr.timeout = 60000; // 60 segundos
      xhr.open('POST', this.API_URL);
      xhr.send(formData);
    });
  }
}