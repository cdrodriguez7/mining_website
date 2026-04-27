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

interface DatoTecnico {
  label: string;
  value: string;
}

interface Hito {
  anio: string;
  titulo: string;
  descripcion: string;
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

  // Descripción general del complejo
  descripcion = 'El complejo de PLANPROMIN S.A. en el sector Shumiral es el mayor centro de beneficio del distrito aurífero de Camilo Ponce Enríquez. Con una capacidad combinada de ~2,440 toneladas por día —distribuidas en cuatro módulos de mineral fresco, un módulo de flotación de relaves y la Planta Lajo— transforma el mineral aurífero extraído por concesionarios artesanales y de pequeña escala en barras de doré y concentrado polimetálico. Habilitado en 2024 por el Ministerio de Energía y Minas y certificado ambientalmente por el MAATE en 2025, PLANPROMIN opera con todos los instrumentos regulatorios vigentes y genera empleo directo en la zona de influencia del cantón.';

  // Hitos históricos para el timeline
  hitos: Hito[] = [
    {
      anio: '2011',
      titulo: 'Fundación de PLANPROMIN',
      descripcion: 'Constitución de la empresa en Machala con la visión de crear infraestructura de beneficio para el distrito aurífero de Camilo Ponce Enríquez.'
    },
    {
      anio: '2024',
      titulo: 'Habilitación del Complejo Principal',
      descripcion: 'El Ministerio de Energía y Minas autoriza los 4 módulos de mineral fresco (1,040 TPD) y el módulo de flotación de relaves (1,000 TPD), consolidando la mayor capacidad instalada del distrito.'
    },
    {
      anio: '2024',
      titulo: 'Inicio de Operaciones Formales',
      descripcion: 'Primer trimestre en operación bajo registro minero oficial. El complejo comienza a recibir mineral de concesionarios artesanales del sector Shumiral y zonas aledañas.'
    },
    {
      anio: '2024',
      titulo: 'Incorporación Planta Lajo',
      descripcion: 'Se suma una segunda instalación de 400 TPD mediante contrato de cesión, ampliando la capacidad total del complejo a ~2,440 TPD y reforzando la oferta de procesamiento del distrito.'
    },
    {
      anio: '2025',
      titulo: 'Certificación Ambiental MAATE',
      descripcion: 'El Ministerio del Ambiente emite el certificado de cumplimiento ambiental, validando que las instalaciones no afectan el SNAP, Patrimonio Forestal ni zonas de conservación.'
    }
  ];

  // Datos técnicos y legales del proyecto
  datosTecnicos: DatoTecnico[] = [
    { label: 'UBICACIÓN', value: 'Sector Shumiral, Camilo Ponce Enríquez, Provincia del Azuay — Ecuador' },
    { label: 'TIPO DE OPERACIÓN', value: 'Planta de beneficio de minerales auríferos y reprocesamiento de relaves al servicio de la minería artesanal y de pequeña escala' },
    { label: 'CAPACIDAD DE PROCESAMIENTO', value: '~2,440 TPD en total: 1,040 TPD en mineral fresco (4 módulos de 260 TPD), 1,000 TPD en relaves (Módulo de Flotación) y 400 TPD adicionales en Planta Lajo' },
    { label: 'PRODUCTOS', value: 'Barras de doré (aleación oro–plata) y concentrado polimetálico para exportación o refinación nacional' },
    { label: 'ÁREA DE LA INSTALACIÓN', value: '20.83 hectáreas declaradas ante el SUIA en el sector Shumiral — no intersecta el SNAP, Patrimonio Forestal del Estado ni Zonas Intangibles' },
    { label: 'HABILITACIÓN MINERA', value: 'Autorizado por el Ministerio de Energía y Minas, Zona 6 (febrero 2024); inscrito en el Registro Minero ARCERNNR–Azuay en febrero de 2024' },
    { label: 'CERTIFICACIÓN AMBIENTAL', value: 'Certificado ambiental MAATE vigente desde mayo de 2025; proceso de Licencia Ambiental en curso para actividades de mayor escala' },
    { label: 'CIUDAD MÁS CERCANA', value: 'Machala (Provincia de El Oro) — aprox. 2 horas en carretera' },
    { label: 'ACCESO', value: 'Vía asfaltada desde Cuenca (~3 h) o desde Machala (~2 h) hasta el cantón Camilo Ponce Enríquez, y carretera de ingreso hacia el sector Shumiral' },
    { label: 'INICIO DE OPERACIONES', value: 'Planta principal en operación desde el primer trimestre de 2024; Planta Lajo incorporada en septiembre de 2024' }
  ];

  constructor(
    private cloudinaryService: CloudinaryService,
    private galleryService: GalleryService,
    private imageSelectorService: ImageSelectorService
  ) { }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    try {
      this.isLoading = true;
      await this.galleryService.initializeForSection(SECTION_FOLDERS.OPERACIONES);

      const allImages = this.galleryService.getAllImages();

      if (allImages.length > 0) {
        this.heroImage = this.imageSelectorService.selectImage(allImages, {
          aspectRatio: 'landscape',
          minWidth: 800
        });

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
    this.previewUrl = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}
