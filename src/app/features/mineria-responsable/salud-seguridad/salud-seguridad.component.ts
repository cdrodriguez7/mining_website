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
  selector: 'app-salud-seguridad',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './salud-seguridad.component.html',
  styleUrls: ['./salud-seguridad.component.scss']
})
export class SaludSeguridadComponent implements OnInit {
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  sectionImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  kpis = [
    { valor: '0',    etiqueta: 'Fatalidades',            periodo: '2024',                    color: 'text-green-400',   borde: 'border-green-500' },
    { valor: '1.2',  etiqueta: 'TRIR',                   periodo: 'Tasa de Incidentes Reg.',  color: 'text-orange-400',  borde: 'border-orange-500' },
    { valor: '2.1M', etiqueta: 'Horas Trabajadas',       periodo: 'Sin accidente grave 2024', color: 'text-blue-400',    borde: 'border-blue-500' },
    { valor: '100%', etiqueta: 'Cumplimiento Normativo', periodo: 'IESS / Ministerio Trabajo', color: 'text-emerald-400', borde: 'border-emerald-500' },
  ];

  programas = [
    {
      titulo: 'Capacitación Continua',
      items: [
        'Inducción obligatoria de 40 horas para nuevos colaboradores',
        'Capacitaciones mensuales en prevención de riesgos específicos',
        'Simulacros de emergencia trimestrales',
        'Formación en primeros auxilios para el 100% del personal operativo',
      ]
    },
    {
      titulo: 'Control de Riesgos Operativos',
      items: [
        'Análisis de riesgo pre-tarea (ART) en todas las operaciones',
        'Inspecciones diarias de equipo y zonas de trabajo',
        'Sistema de reporte de condiciones inseguras (tarjeta de observación)',
        'Programa de control de exposición a polvo y ruido',
      ]
    },
    {
      titulo: 'Preparación para Emergencias',
      items: [
        'Brigada de rescate minero certificada — 8 miembros',
        'Protocolo de evacuación para todos los niveles de la mina',
        'Botiquines AED instalados en 6 puntos estratégicos',
        'Convenio de respuesta con hospital cantonal de CPE',
      ]
    },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.SEGURIDAD);
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
