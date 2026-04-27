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
      produccion: '38,000 - 45,000',
      capitalSustaining: '2 - 3',
      costoOperativo: '400 - 450',
      aisc: '520 - 580',
      throughput: 1400,
      leyPromedio: 3.0,
      recuperacion: '88%'
    },
    {
      year: 2027,
      produccion: '40,000 - 47,000',
      capitalSustaining: '3 - 4',
      costoOperativo: '390 - 440',
      aisc: '510 - 570',
      throughput: 1400,
      leyPromedio: 3.2,
      recuperacion: '89%'
    },
    {
      year: 2028,
      produccion: '43,000 - 52,000',
      capitalSustaining: '2 - 3',
      costoOperativo: '380 - 430',
      aisc: '490 - 550',
      throughput: 1600,
      leyPromedio: 3.4,
      recuperacion: '90%'
    }
  ];

  // Notas de proyecciones
  notasProyecciones = [
    'Supuesto de precio de oro: $2,100/oz. Producción expresada en onzas troy de oro recuperado',
    'Los costos operativos incluyen procesamiento, reactivos, mano de obra, administración y transporte',
    'AISC incluye costos operativos, capital sustentante y regalías regulatorias',
    'Ley promedio variable según el lote de mineral y relaves recibidos del sector artesanal',
    'Las proyecciones están sujetas a condiciones de mercado, disponibilidad de mineral y operativas'
  ];

  // Programas de inversión y mejora
  programaExploracion: ProgramaExploracion[] = [
    {
      nombre: 'Ampliación de Capacidad',
      presupuesto: '$3.5M',
      objetivo: 'Incremento de la capacidad de procesamiento de 1,400 a 2,000 TPD mediante la incorporación de nuevos molinos de bolas y circuitos de flotación adicionales'
    },
    {
      nombre: 'Modernización de Circuitos',
      presupuesto: '$2.2M',
      objetivo: 'Actualización de concentradores gravimétricos centrífugos y equipos de flotación para mejorar la eficiencia metalúrgica y reducir el consumo de reactivos'
    },
    {
      nombre: 'Gestión de Relaves',
      presupuesto: '$1.8M',
      objetivo: 'Expansión de la relavera y mejora del sistema de recuperación y recirculación de agua para incrementar la capacidad de almacenamiento seguro de relaves'
    }
  ];

  // Inversión de capital
  inversionCapital = {
    titulo: 'Plan de Inversión de Capital 2026-2028',
    sustaining: {
      total: '$4 - 6 Millones',
      descripcion: 'Inversión en mantenimiento de infraestructura del complejo beneficiador, reemplazo de equipos críticos y cumplimiento ambiental',
      items: [
        'Mantenimiento mayor de molinos y concentradores',
        'Reemplazo de partes críticas en circuito CIL',
        'Mejoras en planta de detoxificación de colas',
        'Monitoreo ambiental y gestión de relaves'
      ]
    },
    expansion: {
      total: '$7 - 9 Millones',
      descripcion: 'Proyectos de expansión de capacidad y optimización de procesos para atender la creciente demanda del sector artesanal',
      items: [
        'Nueva línea de molienda (molinos de bolas)',
        'Concentradores gravimétricos adicionales',
        'Expansión del circuito CIL y tanques de lixiviación',
        'Modernización del laboratorio de análisis metalúrgico'
      ]
    }
  };

  // Objetivos estratégicos
  objetivosEstrategicos = [
    {
      titulo: 'Incremento de Tonelaje Procesado',
      descripcion: 'Aumentar la capacidad de procesamiento de 1,400 TPD a 2,000 TPD para atender la creciente demanda del sector minero artesanal y de pequeña escala de la zona'
    },
    {
      titulo: 'Mejora de Recuperación Metalúrgica',
      descripcion: 'Elevar la recuperación promedio al 90% mediante optimización de procesos gravimétricos, flotación y CIL, y renovación de equipos clave del complejo'
    },
    {
      titulo: 'Expansión del Programa de Relaves',
      descripcion: 'Ampliar el circuito de reprocesamiento de relaves para tratar volúmenes históricos adicionales del sector, recuperando oro residual y contribuyendo a la remediación ambiental'
    },
    {
      titulo: 'Gestión Ambiental Certificada',
      descripcion: 'Obtener certificación ISO 14001, adherirse al Código Internacional de Manejo del Cianuro y reducir el consumo de agua mediante mejoras en el sistema de recirculación'
    }
  ];

  // Factores de riesgo
  factoresRiesgo = [
    'Variaciones en precios internacionales de oro y metales base',
    'Disponibilidad y regularidad del flujo de mineral proveniente del sector artesanal',
    'Variaciones en el precio de reactivos (cianuro, cal, floculantes) y energía eléctrica',
    'Cambios regulatorios en el marco legal minero ecuatoriano',
    'Condiciones de seguridad y operacionales en el distrito de Camilo Ponce Enríquez',
    'Disponibilidad de agua durante época seca para el proceso de lixiviación'
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