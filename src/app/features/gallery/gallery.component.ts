import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ImagePreviewComponent } from '../../shared/components/image-preview/image-preview.component';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { CloudinaryImage, GalleryFolder, GALLERY_FOLDERS } from '../../core/models/gallery.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ImagePreviewComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  isLoading = true;

  allImages: CloudinaryImage[] = [];
  filteredImages: CloudinaryImage[] = [];
  folders: GalleryFolder[] = [];
  selectedFolder: string = 'all';

  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadGallery();
  }

  async loadGallery() {
    try {
      this.isLoading = true;
      await this.galleryService.initialize();

      const allImages = this.galleryService.getAllImages();
      this.allImages = allImages;
      this.filteredImages = [...this.allImages];
      this.folders = this.galleryService.getFolders().filter(f => f.name !== 'all');

      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando galería:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  filterByFolder(folderName: string) {
    this.selectedFolder = folderName;
    if (folderName === 'all') {
      this.filteredImages = [...this.allImages];
    } else {
      this.filteredImages = this.allImages.filter(img => img.folder === folderName);
    }
    this.cdr.detectChanges();
  }

  /** Metadata de la carpeta activa (para mostrar descripción) */
  get activeFolderMeta(): GalleryFolder | undefined {
    if (this.selectedFolder === 'all') return undefined;
    return GALLERY_FOLDERS.find(f => f.name === this.selectedFolder);
  }

  /** Etiqueta display del folder de una imagen */
  getCategoryLabel(folderName: string): string {
    const found = GALLERY_FOLDERS.find(f => f.name === folderName);
    return found ? found.displayName : folderName;
  }

  getImageCountByFolder(folderName: string): number {
    return this.allImages.filter(img => img.folder === folderName).length;
  }

  openPreview(image: CloudinaryImage): void {
    this.previewUrl     = this.cloudinaryService.getHeroUrl(image.publicId, 1920);
    this.previewTitle   = image.title;
    this.previewVisible = true;
    this.cdr.detectChanges();
  }

  closePreview(): void {
    this.previewVisible = false;
    this.previewUrl     = '';
    this.previewTitle   = '';
    this.cdr.detectChanges();
  }

  getImageUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 600);
  }

  onImageError(event: any, image: CloudinaryImage) {
    const fallbackUrl = `https://res.cloudinary.com/dlumbzsnd/image/upload/${image.publicId}`;
    event.target.src = fallbackUrl;
  }
}