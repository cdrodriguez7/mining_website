import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../../core/models/gallery.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class MrOverviewComponent implements OnInit {
  private cloudinaryService = inject(CloudinaryService);
  private galleryService    = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  galleryImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  pilares = [
    { icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2zM3 7l9-4 9 4', label: 'Política', link: '/mineria-responsable/politica', desc: 'Marco de compromisos y principios QHSE' },
    { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Salud y Seguridad', link: '/mineria-responsable/salud-seguridad', desc: '0 fatalidades · TRIR 1.2 · ISO 45001' },
    { icon: 'M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 0M3 9h18', label: 'Medio Ambiente', link: '/mineria-responsable/medio-ambiente', desc: 'Gestión hídrica, reforestación y residuos' },
    { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-4.9-6H7a4 4 0 00-4 4z', label: 'Cambio Climático', link: '/mineria-responsable/cambio-climatico', desc: 'Meta -20% GHG al 2030 · Plan de acción' },
    { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0', label: 'Comunidades', link: '/mineria-responsable/comunidades', desc: '75% empleo local · Fundación PLAMPROMIN' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Gobernanza ESG', link: '/mineria-responsable/gobernanza', desc: 'Reporte GRI · Auditoría externa independiente' },
  ];

  metricas = [
    { valor: '0', unidad: 'Fatalidades', periodo: '2024', color: 'text-green-400' },
    { valor: '1.2', unidad: 'TRIR', periodo: 'Tasa de incidentes registrables', color: 'text-orange-400' },
    { valor: '+500', unidad: 'Hectáreas', periodo: 'Reforestadas', color: 'text-emerald-400' },
    { valor: '75%', unidad: 'Empleo Local', periodo: 'Fuerza laboral de la región', color: 'text-blue-400' },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.ALL);
      const all = this.galleryService.getAllImages();
      this.heroImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'landscape', minWidth: 800 });
      this.galleryImages = this.imageSelectorService.selectImages(all, { aspectRatio: 'any' }, 4);
    } finally {
      this.isLoading = false;
    }
  }

  getHeroUrl(): string {
    return this.heroImage ? this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920) : '';
  }

  getImageUrl(img: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(img.publicId, 800);
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
