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
  selector: 'app-medio-ambiente',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './medio-ambiente.component.html',
  styleUrls: ['./medio-ambiente.component.scss']
})
export class MedioAmbienteComponent implements OnInit {
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  sectionImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  programas = [
    {
      icono: 'M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1v9a1 1 0 001 1h10a1 1 0 001-1V7h1a1 1 0 001-1V5a1 1 0 00-1-1H3zm3 3h8v8H6V7zm2 2v4h4V9H8z',
      titulo: 'Gestión Hídrica',
      descripcion: 'Monitoreamos la calidad del agua en 12 puntos de muestreo a lo largo de los ríos Gala, Tenguel y Siete. Los parámetros de pH, turbidez, metales disueltos y DBO se registran mensualmente y se reportan al Ministerio del Ambiente.',
      kpis: ['12 puntos de monitoreo activos', 'pH 6.8–7.4 mantenido', '0 derrames al ecosistema hídrico en 2024']
    },
    {
      icono: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      titulo: 'Reforestación y Biodiversidad',
      descripcion: 'La zona de Camilo Ponce Enríquez alberga remanentes de bosque nublado entre los 1.800 y 3.200 msnm. Nuestro programa de revegetación prioriza especies nativas como arrayan, pumamaqui y aliso para restaurar corredores biológicos.',
      kpis: ['518 hectáreas reforestadas (2020–2024)', '23 especies nativas plantadas', 'Corredor biológico Gala–Siete en restauración']
    },
    {
      icono: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      titulo: 'Manejo de Residuos y Relaves',
      descripcion: 'Operamos una planta de tratamiento de relaves con sistema de circuito cerrado. Los residuos peligrosos se gestionan mediante gestores autorizados. La tasa de reciclaje de materiales de operación supera el 60%.',
      kpis: ['Circuito cerrado de relaves certificado', '60%+ tasa de reciclaje operacional', 'Cero disposición de residuos peligrosos en sitio']
    },
  ];

  indicadores = [
    { valor: '12', desc: 'Puntos monitoreo hídrico', color: 'border-blue-500' },
    { valor: '518 ha', desc: 'Reforestadas 2020–2024', color: 'border-green-500' },
    { valor: '0', desc: 'Derrames registrados 2024', color: 'border-orange-500' },
    { valor: 'ISO 14001', desc: 'Certificación ambiental', color: 'border-emerald-500' },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.MEDIO_AMBIENTE);
      const all = this.galleryService.getAllImages();
      this.heroImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'landscape', minWidth: 800 });
      this.sectionImages = this.imageSelectorService.selectImages(all, { aspectRatio: 'any' }, 3);
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
