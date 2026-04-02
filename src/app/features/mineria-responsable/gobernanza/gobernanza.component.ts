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
  selector: 'app-gobernanza',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './gobernanza.component.html',
  styleUrls: ['./gobernanza.component.scss']
})
export class GobernanzaComponent implements OnInit {
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  sectionImage: CloudinaryImage | null = null;
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  marcos = [
    { nombre: 'GRI Standards 2021', desc: 'Reporte de sostenibilidad bajo Global Reporting Initiative, con índice de contenido GRI completo.' },
    { nombre: 'ODS / SDGs', desc: 'Alineación con los Objetivos de Desarrollo Sostenible de la ONU, con énfasis en ODS 8, 12, 13 y 17.' },
    { nombre: 'GHG Protocol', desc: 'Inventario de emisiones de Alcance 1 y 2 verificado bajo el Corporate Accounting and Reporting Standard.' },
    { nombre: 'ESTMA (Canadá)', desc: 'Reporte de pagos al gobierno bajo la Extractive Sector Transparency Measures Act.' },
    { nombre: 'Código de Minería Ecuador', desc: 'Cumplimiento íntegro de la Ley de Minería y sus reglamentos, incluyendo regalías y reportes al ARCOM.' },
    { nombre: 'ICRSS / IRMA', desc: 'En proceso de evaluación bajo el estándar de Responsible Mining Assurance para certificación futura.' },
  ];

  estructura = [
    { nivel: 'Directorio', rol: 'Supervisión ESG — Comité de Sostenibilidad del Directorio se reúne trimestralmente.' },
    { nivel: 'Gerencia General', rol: 'Liderazgo ejecutivo en estrategia ESG, rendición de cuentas al Directorio.' },
    { nivel: 'Gerencia QHSE', rol: 'Implementación operativa: ambiente, seguridad, salud y cumplimiento normativo.' },
    { nivel: 'Jefes de Área', rol: 'Responsables de KPIs ESG específicos en cada proceso productivo y de soporte.' },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.EMPRESA);
      const all = this.galleryService.getAllImages();
      this.heroImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'landscape', minWidth: 800 });
      this.sectionImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'any' });
    } finally {
      this.isLoading = false;
    }
  }

  getHeroUrl(): string {
    return this.heroImage ? this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920) : '';
  }

  getSectionUrl(): string {
    return this.sectionImage ? this.cloudinaryService.getCardUrl(this.sectionImage.publicId, 800) : '';
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
