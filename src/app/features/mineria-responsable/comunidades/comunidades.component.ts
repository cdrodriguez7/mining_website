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
  selector: 'app-comunidades',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.scss']
})
export class ComunidadesComponent implements OnInit {
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);

  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  sectionImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  stats = [
    { valor: '75%',  etiqueta: 'Empleo Local',       desc: 'Trabajadores de CPE y zona de influencia' },
    { valor: '15',   etiqueta: 'Becas Anuales',       desc: 'Educación superior para jóvenes del cantón' },
    { valor: '$480K', etiqueta: 'Inversión Social',   desc: 'Acumulada 2020–2024 en proyectos comunitarios' },
    { valor: '8',    etiqueta: 'Comunidades',          desc: 'En el área de influencia directa' },
  ];

  programas = [
    {
      titulo: 'Educación y Becas',
      descripcion: 'A través de la Fundación PLAMPROMIN, financiamos 15 becas universitarias anuales para jóvenes de Camilo Ponce Enríquez y comunidades vecinas. Desde 2018, más de 90 estudiantes han accedido a educación superior técnica o universitaria.',
      imagen: 0
    },
    {
      titulo: 'Infraestructura Comunitaria',
      descripcion: 'Cofinanciamos el mantenimiento de vías de acceso rurales, el sistema de agua potable de la parroquia Camilo Ponce Enríquez y la electrificación de dos recintos aledaños. Trabajamos en coordinación con el GAD Municipal.',
      imagen: 1
    },
    {
      titulo: 'Consulta Previa e Información',
      descripcion: 'Cumplimos con el proceso de consulta previa libre e informada establecido en la Constitución ecuatoriana y el Convenio 169 de la OIT. Las comunidades participan activamente en el monitoreo ambiental y la revisión de planes de manejo.',
      imagen: 2
    },
  ];

  async ngOnInit() {
    try {
      await this.galleryService.initializeForSection(SECTION_FOLDERS.COMUNIDADES);
      const all = this.galleryService.getAllImages();
      this.heroImage = this.imageSelectorService.selectImage(all, { aspectRatio: 'landscape', minWidth: 800 });
      this.sectionImages = this.imageSelectorService.selectImages(all, { aspectRatio: 'any' }, 4);
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
