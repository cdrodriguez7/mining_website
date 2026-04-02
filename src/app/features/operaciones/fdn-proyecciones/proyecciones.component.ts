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

interface ProyeccionAnual {
  year: number;
  produccion: string;
  capitalSustaining: string;
  costoOperativo: string;
  aisc: string;
  throughput: number;
  leyPromedio: number;
  recuperacion: string;
}

interface ProgramaExploracion {
  nombre: string;
  presupuesto: string;
  objetivo: string;
}

@Component({
  selector: 'app-proyecciones',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './proyecciones.component.html',
  styleUrls: ['./proyecciones.component.scss']
})
export class ProyeccionesComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  // Proyecciones 2026-2028
  proyecciones: ProyeccionAnual[] = [
    {
      year: 2026,
      produccion: '60,000 - 65,000',
      capitalSustaining: '8 - 10',
      costoOperativo: '850 - 900',
      aisc: '1,050 - 1,100',
      throughput: 5000,
      leyPromedio: 8.3,
      recuperacion: '91%'
    },
    {
      year: 2027,
      produccion: '62,000 - 67,000',
      capitalSustaining: '10 - 12',
      costoOperativo: '840 - 890',
      aisc: '1,080 - 1,150',
      throughput: 5000,
      leyPromedio: 8.5,
      recuperacion: '91%'
    },
    {
      year: 2028,
      produccion: '65,000 - 70,000',
      capitalSustaining: '7 - 9',
      costoOperativo: '830 - 880',
      aisc: '980 - 1,050',
      throughput: 5500,
      leyPromedio: 8.6,
      recuperacion: '92%'
    }
  ];

  // Notas de proyecciones
  notasProyecciones = [
    'Los supuestos de precio de oro/plata por onza son $2,100/$26.00 respectivamente',
    'Los costos operativos incluyen minado, procesamiento, administración general y transporte',
    'AISC (All-In Sustaining Cost) incluye costos operativos, capital sustentante y regalías',
    'Las proyecciones están sujetas a condiciones de mercado y operativas'
  ];

  // Programa de exploración
  programaExploracion: ProgramaExploracion[] = [
    {
      nombre: 'Exploración Near-Mine',
      presupuesto: '$5.5M',
      objetivo: 'Extensión de recursos minerales en vetas conocidas y exploración de estructuras paralelas dentro del área de concesión'
    },
    {
      nombre: 'Exploración Regional',
      presupuesto: '$2.8M',
      objetivo: 'Identificación de nuevos blancos exploratorios en el distrito minero Ponce Enríquez y evaluación de anomalías geoquímicas'
    },
    {
      nombre: 'Perforación de Definición',
      presupuesto: '$4.2M',
      objetivo: 'Conversión de recursos inferidos a medidos e indicados en zonas de alta ley identificadas'
    }
  ];

  // Inversión de capital
  inversionCapital = {
    titulo: 'Plan de Inversión de Capital 2026-2028',
    sustaining: {
      total: '$25 - 31 Millones',
      descripcion: 'Inversión en mantenimiento de infraestructura, reemplazo de equipos, desarrollos mineros y gestión de colas',
      items: [
        'Desarrollo y preparación de nuevas áreas de minado',
        'Mantenimiento mayor de equipos críticos',
        'Mejoras en planta de procesamiento',
        'Gestión de relaves y monitoreo ambiental'
      ]
    },
    expansion: {
      total: '$12 - 15 Millones',
      descripcion: 'Proyectos de expansión y optimización',
      items: [
        'Incremento de capacidad de molienda a 5,500 tpd',
        'Optimización del circuito de flotación',
        'Sistema de recuperación de agua mejorado',
        'Infraestructura de acceso a zonas profundas'
      ]
    }
  };

  // Objetivos estratégicos
  objetivosEstrategicos = [
    {
      titulo: 'Crecimiento de Producción',
      descripcion: 'Incrementar producción anual de 60,000 oz (2026) a 70,000 oz (2028) mediante optimización operativa y expansión de capacidad'
    },
    {
      titulo: 'Reducción de Costos',
      descripcion: 'Reducir AISC de $1,100/oz a $1,050/oz mediante mejoras en eficiencia, optimización de procesos y economías de escala'
    },
    {
      titulo: 'Extensión de Recursos',
      descripcion: 'Incrementar recursos minerales mediante exploración near-mine y conversión de recursos inferidos a medidos/indicados'
    },
    {
      titulo: 'Sostenibilidad',
      descripcion: 'Mantener certificación ISO 14001, reducir consumo de agua en 15% y neutralizar emisiones de carbono al 2030'
    }
  ];

  // Factores de riesgo
  factoresRiesgo = [
    'Variaciones en precios internacionales de oro y metales base',
    'Condiciones geotécnicas en zonas profundas de la mina',
    'Disponibilidad de agua durante época seca',
    'Cambios regulatorios en el marco legal minero ecuatoriano',
    'Condiciones de seguridad y operacionales en el distrito'
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
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });
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

  openPreview(url: string, title: string): void {
    this.previewUrl   = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }
}