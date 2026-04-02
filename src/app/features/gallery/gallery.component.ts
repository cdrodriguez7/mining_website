import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { UploadComponent } from './upload.component';
import { ImagePreviewComponent } from '../../shared/components/image-preview/image-preview.component';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { CloudinaryImage, GalleryFolder } from '../../core/models/gallery.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    UploadComponent,
    ImagePreviewComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  isLoading = true;
  showUpload = false;

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
      
      console.log('=== CARGANDO GALERIA ===');
      
      await this.galleryService.initialize();
      
      const allImages = this.galleryService.getAllImages();
      
      console.log('Imagenes recibidas del servicio:', allImages.length);
      console.log('Public IDs:', allImages.map(img => img.publicId));
      
      this.allImages = allImages;
      this.filteredImages = [...this.allImages];
      this.folders = this.galleryService.getFolders();
      
      console.log('Total imagenes:', this.allImages.length);
      console.log('Desde Cloudinary:', this.allImages.length);
      console.log('Subidas via upload: 0');
      console.log('=== GALERIA CARGADA ===');
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }

  async reloadGallery() {
    console.log('Recargando galeria...');
    this.isLoading = true;
    
    await this.galleryService.reload();
    
    const allImages = this.galleryService.getAllImages();
    this.allImages = allImages;
    this.filteredImages = [...this.allImages];
    
    console.log('Galeria recargada:', this.allImages.length, 'imagenes');
    
    this.isLoading = false;
  }

  filterByFolder(folderName: string) {
    this.selectedFolder = folderName;
    
    if (folderName === 'all') {
      this.filteredImages = [...this.allImages];
    } else {
      this.filteredImages = this.allImages.filter(img => img.folder === folderName);
    }
    
    console.log(`Filtrado por ${folderName}:`, this.filteredImages.length, 'imagenes');
  }

  onImageUploaded() {
    console.log('Imagen subida, recargando galeria...');
    this.reloadGallery();
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

  getThumbnailUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getThumbnailUrl(image.publicId, 200);
  }

  onImageError(event: any, image: CloudinaryImage) {
    console.error('Error cargando imagen:', image.publicId);
    console.error('URL intentada:', event.target.src);
    
    const fallbackUrl = `https://res.cloudinary.com/dlumbzsnd/image/upload/${image.publicId}`;
    event.target.src = fallbackUrl;
  }

  getImageCountByFolder(folderName: string): number {
    return this.allImages.filter(img => img.folder === folderName).length;
  }
}