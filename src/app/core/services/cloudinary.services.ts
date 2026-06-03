import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Opciones de transformación de imagen.
 * Cuando se habilite Cloudflare Image Resizing (requiere custom domain + plan Pro),
 * estas opciones se traducen a parámetros de cdn-cgi/image/.
 * Mientras tanto, se devuelve la URL original sin transformaciones.
 */
export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: string;
}

export interface R2UploadResponse {
  key: string;
  url: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly PUBLIC_URL: string;
  private readonly CUSTOM_DOMAIN: string;
  private readonly IMAGE_RESIZING: boolean;

  constructor() {
    this.PUBLIC_URL = environment.r2.publicUrl.replace(/\/$/, '');
    this.CUSTOM_DOMAIN = environment.r2.customDomain?.replace(/\/$/, '') || '';
    this.IMAGE_RESIZING = environment.r2.imageResizing ?? false;

    console.log('☁️ R2 Image Service inicializado');
    console.log('📦 Public URL:', this.PUBLIC_URL);
  }

  /**
   * Construye la URL pública de una imagen en R2.
   *
   * Si Cloudflare Image Resizing está habilitado (custom domain + plan Pro),
   * genera una URL con transformaciones on-the-fly:
   *   https://cdn.planpromin.com/cdn-cgi/image/width=800,height=600,fit=cover/mineria/home/hero.jpg
   *
   * Si no, devuelve la URL directa del objeto:
   *   https://pub-xxx.r2.dev/mineria/home/hero.jpg
   */
  getImageUrl(publicId: string, options?: TransformOptions): string {
    const key = publicId.startsWith('/') ? publicId.slice(1) : publicId;

    if (this.IMAGE_RESIZING && this.CUSTOM_DOMAIN && options) {
      const params = this.buildTransformParams(options);
      if (params) {
        return `${this.CUSTOM_DOMAIN}/cdn-cgi/image/${params}/${key}`;
      }
    }

    return `${this.PUBLIC_URL}/${key}`;
  }

  /**
   * URL responsiva con tamaño específico.
   */
  getResponsiveUrl(publicId: string, width: number, height: number): string {
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto'
    });
  }

  /**
   * URL de miniatura cuadrada.
   */
  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill'
    });
  }

  /**
   * URL para imágenes hero (16:9).
   */
  getHeroUrl(publicId: string, width: number = 1600): string {
    const height = Math.round(width * 9 / 16);
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto'
    });
  }

  /**
   * URL para tarjetas (4:3).
   */
  getCardUrl(publicId: string, width: number = 400): string {
    const height = Math.round(width * 3 / 4);
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill'
    });
  }

  /**
   * Subir imagen a R2 mediante presigned URL.
   * 1. Solicita un presigned URL al backend
   * 2. Sube el archivo directamente a R2
   */
  async uploadImage(
    file: File,
    folder?: string,
    onProgress?: (progress: number) => void
  ): Promise<R2UploadResponse> {
    // Paso 1: Obtener presigned URL del backend
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const queryParams = new URLSearchParams({ filename });
    if (folder) queryParams.set('folder', folder);

    const presignResponse = await fetch(`/api/upload?${queryParams.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!presignResponse.ok) {
      const err = await presignResponse.text();
      throw new Error(`Error obteniendo URL de subida: ${err}`);
    }

    const { uploadUrl, key, publicUrl } = await presignResponse.json();

    // Paso 2: Subir directamente a R2 con presigned URL
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('✅ Upload exitoso a R2:', key);
          resolve({
            key,
            url: publicUrl,
            size: file.size
          });
        } else {
          reject(new Error(`Error HTTP ${xhr.status} al subir a R2`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Error de conexión con R2'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout al subir la imagen'));
      });

      xhr.timeout = 120000; // 120 segundos
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Construye parámetros de Cloudflare Image Resizing.
   * Formato: width=800,height=600,fit=cover,quality=auto
   * Ref: https://developers.cloudflare.com/images/transform-images/transform-via-url/
   */
  private buildTransformParams(options: TransformOptions): string {
    const parts: string[] = [];

    if (options.width) parts.push(`width=${options.width}`);
    if (options.height) parts.push(`height=${options.height}`);

    // Mapear nuestro crop mode al "fit" de Cloudflare
    if (options.crop) {
      const fitMap: Record<string, string> = {
        fill: 'cover',
        fit: 'contain',
        scale: 'scale-down',
        crop: 'crop'
      };
      parts.push(`fit=${fitMap[options.crop] || 'cover'}`);
    }

    if (options.quality === 'auto') {
      parts.push('quality=85');
    } else if (typeof options.quality === 'number') {
      parts.push(`quality=${options.quality}`);
    }

    if (options.format && options.format !== 'auto') {
      parts.push(`format=${options.format}`);
    } else {
      parts.push('format=auto');
    }

    return parts.join(',');
  }
}