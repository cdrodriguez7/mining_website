import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudinaryService, R2UploadResponse } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
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
  selectedFolder = 'mineria/home';

  folders = [
    { value: 'mineria/home',           label: 'Portada (Home)' },
    { value: 'mineria/empresa',        label: 'Empresa' },
    { value: 'mineria/operaciones',    label: 'Operaciones' },
    { value: 'mineria/geologia',       label: 'Geología' },
    { value: 'mineria/seguridad',      label: 'Seguridad' },
    { value: 'mineria/medio-ambiente', label: 'Medio Ambiente' },
    { value: 'mineria/comunidades',    label: 'Comunidades' },
    { value: 'mineria/noticias',       label: 'Noticias (imágenes referenciales)' },
    { value: 'mineria/galeria',        label: 'Galería destacadas' },
  ];

  constructor(
    private imageService: CloudinaryService,
    private galleryService: GalleryService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      const response: R2UploadResponse = await this.imageService.uploadImage(
        file,
        this.selectedFolder,
        (progress) => { this.uploadProgress = progress; }
      );

      const newImage: CloudinaryImage = {
        publicId: response.key,
        title: file.name.replace(/\.[^/.]+$/, '') || 'Nueva imagen',
        description: `Subida el ${new Date().toLocaleDateString()}`,
        folder: this.selectedFolder.split('/').pop() || 'general',
        tags: [this.selectedFolder.split('/').pop() || 'general'],
        width: 0,
        height: 0,
        format: file.name.split('.').pop() || 'jpg',
        createdAt: new Date(),
        secureUrl: response.url
      };

      // Registro en memoria solo para mostrar en la sesión actual
      this.uploadedImages.unshift(newImage);

      // Invalida el cache para que las secciones recarguen desde R2
      await this.galleryService.reload();

      this.imageUploaded.emit();
      alert('Imagen subida exitosamente!');

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
    if (confirm('¿Estás seguro de eliminar esta imagen de la lista?')) {
      this.uploadedImages.splice(index, 1);
    }
  }

  getImageUrl(publicId: string): string {
    return this.imageService.getThumbnailUrl(publicId, 300);
  }
}
