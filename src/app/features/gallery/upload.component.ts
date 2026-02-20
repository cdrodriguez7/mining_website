import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CloudinaryService, CloudinaryUploadResponse } from '../../core/services/cloudinary.services';

interface GalleryImage {
  publicId: string;
  title: string;
  description: string;
  tags?: string[];
  uploadedAt?: Date;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  uploadedImage: CloudinaryUploadResponse | null = null;
  errorMessage = '';
  imageTitle = '';
  imageDescription = '';  

constructor(
    private cloudinaryService: CloudinaryService,
    private router: Router
) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor selecciona una imagen válida';
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar los 10MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      
      // Generar título automático del nombre del archivo
      this.imageTitle = file.name.split('.')[0].replace(/[-_]/g, ' ');
    }
  }

  async uploadImage() {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona una imagen';
      return;
    }

    if (!this.imageTitle.trim()) {
      this.errorMessage = 'Por favor ingresa un título para la imagen';
      return;
    }

    this.uploading = true;
    this.errorMessage = '';
    this.uploadProgress = 0;

    // Simular progreso
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    try {
      // Subir a Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        this.selectedFile,
        'mineria' // Carpeta en Cloudinary
      );

      clearInterval(progressInterval);
      this.uploadProgress = 100;
      this.uploadedImage = result;
      
      // Guardar en localStorage para la galería
      this.saveToGallery(result);
      
      console.log('Imagen subida exitosamente:', result);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Error al subir:', error);
      this.errorMessage = error.message || 'Error al subir la imagen. Intenta nuevamente.';
    } finally {
      this.uploading = false;
    }
  }

  saveToGallery(cloudinaryResponse: CloudinaryUploadResponse) {
    const newImage: GalleryImage = {
      publicId: cloudinaryResponse.public_id,
      title: this.imageTitle.trim(),
      description: this.imageDescription.trim() || 'Imagen subida desde la galería',
      tags: ['subida', 'mineria'],
      uploadedAt: new Date()
    };

    // Obtener imágenes existentes
    let existingImages: GalleryImage[] = [];
    try {
      const stored = localStorage.getItem('cloudinary_uploaded_images');
      if (stored) {
        existingImages = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error al leer localStorage:', error);
    }

    // Agregar nueva imagen al inicio
    existingImages.unshift(newImage);

    // Guardar en localStorage
    try {
      localStorage.setItem('cloudinary_uploaded_images', JSON.stringify(existingImages));
      console.log('Imagen guardada en galería local');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  getUploadedImageUrl(): string {
    if (!this.uploadedImage) return '';
    return this.cloudinaryService.getImageUrl(this.uploadedImage.public_id, 600, 400);
  }

  resetUpload() {
    this.selectedFile = null;
    this.uploadedImage = null;
    this.errorMessage = '';
    this.uploadProgress = 0;
    this.imageTitle = '';
    this.imageDescription = '';
  }

  goToGallery() {
    this.router.navigate(['/galeria']);
  }
}