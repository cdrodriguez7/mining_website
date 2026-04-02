import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { NewsService, NewsItem } from '../../../core/services/news.service';
import { GalleryService } from '../../../core/services/gallery.service';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { CloudinaryImage } from '../../../core/models/gallery.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ImagePreviewComponent],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {
  private newsService     = inject(NewsService);
  private galleryService  = inject(GalleryService);
  private cloudinaryService = inject(CloudinaryService);

  anos = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  news: NewsItem[] = [];
  isLoading = true;
  hasError  = false;
  private noticiasImages: CloudinaryImage[] = [];

  async ngOnInit(): Promise<void> {
    // Carga noticias e imágenes fallback en paralelo
    const [, noticiasImgs] = await Promise.all([
      new Promise<void>(resolve => {
        this.newsService.getNews().subscribe({
          next: (items) => { this.news = items; resolve(); },
          error: () => { this.hasError = true; resolve(); }
        });
      }),
      this.galleryService.getNoticiasImages()
    ]);
    this.noticiasImages = noticiasImgs;
    this.isLoading = false;
  }

  refresh(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.hasError  = false;
    this.newsService.refresh().subscribe({
      next:  (items) => { this.news = items; this.isLoading = false; },
      error: ()      => { this.hasError = true; this.isLoading = false; }
    });
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('es-EC', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateStr; }
  }

  getFallbackImage(index: number): string {
    if (this.noticiasImages.length > 0) {
      const img = this.noticiasImages[index % this.noticiasImages.length];
      return this.cloudinaryService.getCardUrl(img.publicId, 600);
    }
    return '';
  }

  openPreview(url: string, title: string): void {
    this.previewUrl   = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}
