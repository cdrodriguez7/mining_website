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

interface CaracteristicaGeologica {
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-geologia-mineralizacion',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './geologia.component.html',
  styleUrls: ['./geologia.component.scss']
})
export class GeologiaComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  geologiaImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  // Tipo de depósito
  tipoDeposito = {
    clasificacion: 'Depósito epitermal de sulfuración intermedia oro-plata',
    caracteristicas: [
      'Vetas y vetillas de cuarzo aurífero',
      'Brechas hidrotermales y stockworks',
      'Mineralización en estructuras de dirección NNW-SSE',
      'Hospedado en rocas volcánicas de la Unidad Pallatanga'
    ]
  };

  // Características geológicas principales
  caracteristicas: CaracteristicaGeologica[] = [
    {
      titulo: 'Extensión del Distrito Minero',
      descripcion: 'Faja metalífera que se extiende aproximadamente 100 km en dirección NE-SW, ubicada en las estribaciones de la Cordillera Occidental del sur de Ecuador',
      icono: ''
    },
    {
      titulo: 'Edad de Mineralización',
      descripcion: 'La mineralización del distrito minero se estima del Mioceno Medio al Superior, con eventos de depositación relacionados a actividad volcánica e intrusiva',
      icono: ''
    },
    {
      titulo: 'Control Estructural',
      descripcion: 'Las vetas tienen dirección preferencial NW-SE, relacionadas a lineamientos y estructuras locales. Afectadas por fallas transversales, principalmente de tipo normal',
      icono: ''
    }
  ];

  // Contexto geológico regional
  contextoRegional = {
    titulo: 'Contexto Geológico Regional',
    parrafos: [
      'El distrito minero Ponce Enríquez se ubica en el Campo Mineral homónimo, dentro del Subdistrito Machala-Naranjal en la parte occidental del Distrito Azuay. Es conocido por sus depósitos de Cu-Au-Mo en pórfidos y vetas, brechas y stockworks epi-mesotermales desarrollados dentro de rocas de caja volcánicas.',
      'El Campo Minero ocupa la parte central donde la Unidad Pallatanga principalmente expuesta forma una banda casi continua limitada por fallas a lo largo de las estribaciones occidentales de la Cordillera Occidental.',
      'La geología comprende rocas volcánicas, volcanosedimentarias e intrusivas. Las rocas volcánicas corresponden a las primeras fases de depositación, las volcanosedimentarias representan eventos más tardíos, y las intrusivas corresponden a pulsos más jóvenes asociados al batolito de Chaucha.'
    ]
  };

  // Mineralización
  mineralizacion = {
    titulo: 'Características de la Mineralización',
    descripcion: 'La mineralización aurífera se presenta principalmente en vetas y vetillas de cuarzo con sulfuros, desarrolladas en estructuras de dirección NNW-SSE, con anchos variables y contenidos de oro que varían según la zona del distrito.',
    zonas: [
      'Las vetas están hospedadas principalmente en andesitas piroxénicas, donde la intrusión de cuerpos menores generó las condiciones para la depositación mineral.',
      'Se identifican depósitos de oro en estructuras (vetas y vetilleos), brechas hidrotermales, stockworks y diseminaciones, relacionadas con pórfidos (±Au, Cu, Mo).',
      'La mineralización metálica se restringe principalmente a las vetas, con zonas de alta ley intercaladas con zonas de menor concentración.'
    ]
  };

  // Mineralogía
  mineralogia = {
    titulo: 'Mineralogía del Depósito',
    descripcion: 'La mineralogía del distrito consiste en cuarzo, sulfuros múltiples incluyendo pirrotina, arsenopirita y calcopirita como minerales más comunes. Otros minerales identificados incluyen epidota, galena, hematita, molibdenita, cuprita y malaquita.',
    detalles: [
      'Los minerales principales son cuarzo aurífero asociado con sulfuros de hierro, cobre, arsénico y zinc.',
      'Se ha identificado presencia de oro ocluido en sulfuros, lo que requiere procesos metalúrgicos específicos para su recuperación.',
      'El yacimiento es rico en sulfuros, con pirrotina, arsenopirita y calcopirita como minerales predominantes en las zonas de mayor ley.'
    ]
  };

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
      await this.galleryService.initializeForSection(SECTION_FOLDERS.GEOLOGIA);
      
      const allImages = this.galleryService.getAllImages();
      
      if (allImages.length > 0) {
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });
        
        // Imágenes de geología - muestras de roca, núcleos de perforación, etc.
        this.geologiaImages = allImages.slice(0, 3);
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