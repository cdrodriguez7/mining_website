import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../../core/models/gallery.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

interface ProyectoStats {
  label: string;
  value: string;
  icon: string;
}
 
interface DatoTecnico {
  label: string;
  value: string;
}
 
interface MapData {
  concesionesMetalicas: number;
  concesionesMateriales: number;
  hectareasTotales: string;
  proyectoPrincipal: string;
  concesionesPrincipales: number;
  hectareasPrincipales: string;
}
 
@Component({
  selector: 'app-operaciones-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  operationImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
 
  // Ruta local del mapa (no usa Cloudinary)
  mapImagePath = 'assets//mapa-concesiones-ponce-enriquez.jpeg';
 
  // Estadísticas principales del mapa
  mapData: MapData = {
    concesionesMetalicas: 27,
    concesionesMateriales: 3,
    hectareasTotales: '65,000',
    proyectoPrincipal: 'Camilo Ponce Enríquez',
    concesionesPrincipales: 7,
    hectareasPrincipales: '5,566'
  };
 
  // Estadísticas destacadas del proyecto
  // proyectoStats: ProyectoStats[] = [
  //   {
  //     label: 'Reservas Probadas',
  //     value: '5.54 M oz',
  //     icon: '⚒️'
  //   },
  //   {
  //     label: 'Ley de Oro',
  //     value: '7.8 g/t',
  //     icon: '💎'
  //   },
  //   {
  //     label: 'Vida Útil',
  //     value: '~12 años',
  //     icon: '📅'
  //   },
  //   {
  //     label: 'Producción Anual',
  //     value: '500K oz',
  //     icon: '🏭'
  //   }
  // ];
 
  // Datos técnicos principales
  datosTecnicos: DatoTecnico[] = [
    { label: 'UBICACIÓN', value: 'Camilo Ponce Enríquez, Azuay, Ecuador' },
    { label: 'PROPIEDAD', value: '100% PLAMPROMIN S.A.' },
    { label: 'TIPO DE MINA', value: 'Subterránea' },
    { label: 'RESERVAS PROBABLES', value: '5.54 millones de onzas de oro con ley 7.81 g/t' },
    { label: 'RECURSOS MEDIDOS E INDICADOS', value: '7.06 millones de onzas de oro con ley 7.17 g/t' },
    { label: 'RECURSOS INFERIDOS', value: '2.36 millones de onzas de oro con ley 5.27 g/t' },
    { label: 'VIDA DE LA MINA', value: '~12 años' },
    { label: 'PRODUCCIÓN FUTURA', value: 'Promedio de 500,000 onzas de oro por año' }
  ];
 
  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService,
    private imageSelectorService: ImageSelectorService
  ) {}

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    try {
      this.isLoading = true;
      await this.galleryService.initializeForSection(SECTION_FOLDERS.OPERACIONES);
      
      const allImages = this.galleryService.getAllImages();
      
      if (allImages.length > 0) {
        // Hero image - landscape
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });
        
        // Operation images - hasta 6 imágenes
        this.operationImages = allImages.slice(0, 6);
      }
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      this.isLoading = false;
    }
  }

  getHeroImageUrl(): string {
    if (!this.heroImage) return '';
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getImageUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 600);
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