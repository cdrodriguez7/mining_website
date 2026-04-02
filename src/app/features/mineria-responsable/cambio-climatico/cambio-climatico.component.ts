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
  selector: 'app-cambio-climatico',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './cambio-climatico.component.html',
  styleUrls: ['./cambio-climatico.component.scss']
})
export class CambioClimaticoComponent implements OnInit {
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  sectionImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  emisionesData = [
    { alcance: 'Alcance 1', descripcion: 'Combustión diésel, explosivos, transporte interno', valor: '8.400', unidad: 'tCO₂e (2024)' },
    { alcance: 'Alcance 2', descripcion: 'Electricidad consumida en planta y campamentos', valor: '1.200', unidad: 'tCO₂e (2024)' },
  ];

  acciones = [
    { anio: '2025', meta: 'Implementación de paneles solares en campamento base — reducción 15% Alcance 2' },
    { anio: '2026', meta: 'Transición de 30% de flota liviana a vehículos híbridos o eléctricos' },
    { anio: '2027', meta: 'Sistema de captura de emisiones fugitivas en área de procesamiento' },
    { anio: '2028', meta: 'Compensación de 2.000 tCO₂e mediante reforestación certificada (VCS)' },
    { anio: '2030', meta: 'Meta: -20% de emisiones absolutas vs. línea base 2022' },
  ];

  iniciativas = [
    { titulo: 'Eficiencia Energética', desc: 'Auditoría energética anual. Motores de alta eficiencia (IE3) en equipos de bombeo y ventilación. Luminaria LED en todas las instalaciones.' },
    { titulo: 'Energía Renovable', desc: 'Estudio de factibilidad aprobado para sistema solar fotovoltaico de 400 kWp. Entrada en operación prevista para Q2 2025.' },
    { titulo: 'Inventario GHG', desc: 'Reporte anual de emisiones bajo metodología GHG Protocol. Verificación externa por tercero independiente desde 2023.' },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.MEDIO_AMBIENTE);
      const all = this.galleryService.getAllImages();
      this.heroImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'landscape', minWidth: 800 });
      this.sectionImages = this.imageSelectorService.selectImages(all, { aspectRatio: 'any' }, 2);
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
