import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudinaryService, CloudinaryUploadResponse } from '../../core/services/cloudinary.services';
import { CloudinaryImage } from '../../core/models/gallery.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Output() imageUploaded = new EventEmitter<void>();
  isUploading = false;
  uploadProgress = 0;
  uploadedImages: CloudinaryImage[] = [];
  selectedFolder = 'mineria/maquinaria';
  
  // Opciones de carpetas
  folders = [
    { value: 'mineria/maquinaria', label: 'Maquinaria' },
    { value: 'mineria/infraestructura', label: 'Infraestructura' },
    { value: 'mineria/extraccion', label: 'Extracción de Mineral' },
    { value: 'mineria/procesamiento', label: 'Procesamiento' },
    { value: 'mineria/seguridad', label: 'Seguridad' },
    { value: 'mineria/medio-ambiente', label: 'Medio Ambiente' }
  ];

  constructor(private cloudinaryService: CloudinaryService) {
    // Cargar imágenes subidas desde localStorage
    this.loadUploadedImages();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async uploadFile(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      console.log('Subiendo imagen:', file.name);
      console.log('Carpeta destino:', this.selectedFolder);

      const response = await this.cloudinaryService.uploadImage(
        file,
        this.selectedFolder,
        (progress) => {
          this.uploadProgress = progress;
          console.log('Progress:', progress + '%');
        }
      );

      console.log('Upload completado:', response);

      // Crear CloudinaryImage
      const newImage: CloudinaryImage = {
        publicId: response.public_id,
        title: response.original_filename || 'Nueva imagen',
        description: `Subida el ${new Date().toLocaleDateString()}`,
        folder: this.selectedFolder.split('/').pop() || 'general',
        tags: [this.selectedFolder.split('/').pop() || 'general'],
        width: response.width,
        height: response.height,
        format: response.format,
        createdAt: new Date(response.created_at),
        secureUrl: response.secure_url
      };

      // Agregar a la lista de subidas
      this.uploadedImages.unshift(newImage);
      
      // Guardar en localStorage
      this.saveUploadedImages();

      // Notificar éxito
      alert('Imagen subida exitosamente!');

      // Resetear progress
      setTimeout(() => {
        this.uploadProgress = 0;
        this.isUploading = false;
      }, 1000);

    } catch (error: any) {
      console.error('Error al subir:', error);
      alert('Error al subir la imagen: ' + error.message);
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  deleteImage(index: number) {
    if (confirm('¿Estás seguro de eliminar esta imagen de la galería?')) {
      this.uploadedImages.splice(index, 1);
      this.saveUploadedImages();
    }
  }

  // Guardar en localStorage
  private saveUploadedImages() {
    try {
      localStorage.setItem('uploadedImages', JSON.stringify(this.uploadedImages));
      console.log('Imágenes guardadas en localStorage');
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  // Cargar desde localStorage
  private loadUploadedImages() {
    try {
      const stored = localStorage.getItem('uploadedImages');
      if (stored) {
        this.uploadedImages = JSON.parse(stored);
        // Convertir strings de fecha a Date objects
        this.uploadedImages.forEach(img => {
          img.createdAt = new Date(img.createdAt);
        });
        console.log('📦 Cargadas', this.uploadedImages.length, 'imágenes desde localStorage');
      }
    } catch (error) {
      console.error('Error cargando desde localStorage:', error);
      this.uploadedImages = [];
    }
  }

  getImageUrl(publicId: string): string {
    return this.cloudinaryService.getThumbnailUrl(publicId, 300);
  }
}