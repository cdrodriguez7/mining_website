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

interface Pilar {
  titulo: string;
  icono: string;
  descripcion: string;
  practicas: string[];
  metricas: {
    nombre: string;
    valor: string;
    tendencia: 'up' | 'stable' | 'down';
  }[];
}

interface Comite {
  nombre: string;
  presidente: string;
  miembros: number;
  frecuencia: string;
  responsabilidades: string[];
  logros2025: string[];
}

@Component({
  selector: 'app-practicas-gobernanza',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './practicas.component.html',
  styleUrls: ['./practicas.component.scss']
})
export class PracticasComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  galleryImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  // Los 4 Pilares de Gobierno Corporativo
  pilares: Pilar[] = [
    {
      titulo: 'Transparencia',
      icono: '',
      descripcion: 'Divulgación completa y oportuna de información financiera, operacional y de gobierno corporativo a todos los stakeholders.',
      practicas: [
        'Publicación trimestral de estados financieros auditados',
        'Reportes anuales de sostenibilidad bajo estándares GRI',
        'Actas de directorio disponibles para accionistas',
        'Portal web con información corporativa actualizada',
        'Conferencias públicas de resultados trimestrales',
        'Divulgación de transacciones con partes relacionadas'
      ],
      metricas: [
        { nombre: 'Reportes publicados 2025', valor: '12', tendencia: 'stable' },
        { nombre: 'Tiempo promedio publicación', valor: '15 días', tendencia: 'up' },
        { nombre: 'Acceso público documentos', valor: '100%', tendencia: 'stable' }
      ]
    },
    {
      titulo: 'Responsabilidad',
      icono: '',
      descripcion: 'Rendición de cuentas clara del directorio y la administración ante los accionistas y la sociedad.',
      practicas: [
        'Evaluación anual del desempeño del directorio',
        'Auditorías externas independientes anuales',
        'Sistema de control interno robusto',
        'Comité de auditoría con mayoría independiente',
        'Responsabilidad fiduciaria documentada',
        'Objetivos medibles para el equipo ejecutivo'
      ],
      metricas: [
        { nombre: 'Cumplimiento objetivos 2025', valor: '94%', tendencia: 'up' },
        { nombre: 'Auditorías realizadas', valor: '3', tendencia: 'stable' },
        { nombre: 'Hallazgos críticos', valor: '0', tendencia: 'stable' }
      ]
    },
    {
      titulo: 'Equidad',
      icono: '',
      descripcion: 'Tratamiento justo y equitativo de todos los accionistas, incluyendo minoritarios y extranjeros.',
      practicas: [
        'Un voto por acción sin restricciones',
        'Protección de derechos de accionistas minoritarios',
        'Política de dividendos clara y consistente',
        'Acceso igualitario a información material',
        'Procedimientos justos en asambleas de accionistas',
        'Prohibición de discriminación en cualquier forma'
      ],
      metricas: [
        { nombre: 'Participación asambleas', valor: '87%', tendencia: 'up' },
        { nombre: 'Quejas accionistas', valor: '0', tendencia: 'stable' },
        { nombre: 'Dividendos distribuidos', valor: '100%', tendencia: 'stable' }
      ]
    },
    {
      titulo: 'Ética y Cumplimiento',
      icono: '',
      descripcion: 'Adhesión a los más altos estándares éticos y cumplimiento riguroso de leyes y regulaciones.',
      practicas: [
        'Código de ética corporativo vinculante',
        'Programa de cumplimiento normativo integral',
        'Canal de denuncias anónimo 24/7',
        'Capacitación anual obligatoria en ética',
        'Política de cero tolerancia a la corrupción',
        'Debida diligencia con terceros'
      ],
      metricas: [
        { nombre: 'Empleados capacitados', valor: '100%', tendencia: 'stable' },
        { nombre: 'Denuncias recibidas', valor: '5', tendencia: 'up' },
        { nombre: 'Casos de corrupción', valor: '0', tendencia: 'stable' }
      ]
    }
  ];

  // Comités del Directorio
  comites: Comite[] = [
    {
      nombre: 'Comité de Auditoría',
      presidente: '[Nombre Director Independiente]',
      miembros: 3,
      frecuencia: 'Reuniones trimestrales',
      responsabilidades: [
        'Supervisar la integridad de estados financieros',
        'Evaluar independencia y desempeño de auditores externos',
        'Revisar sistema de control interno y gestión de riesgos',
        'Monitorear cumplimiento normativo contable y tributario',
        'Aprobar plan anual de auditoría interna'
      ],
      logros2025: [
        'Implementación de nuevo sistema ERP financiero',
        'Certificación ISO 9001:2015 en procesos contables',
        'Reducción del 30% en hallazgos de auditoría'
      ]
    },
    {
      nombre: 'Comité de Sostenibilidad (ESG)',
      presidente: '[Nombre Director Independiente]',
      miembros: 3,
      frecuencia: 'Reuniones bimensuales',
      responsabilidades: [
        'Definir estrategia de sostenibilidad corporativa',
        'Supervisar desempeño ambiental y social',
        'Evaluar riesgos climáticos y ambientales',
        'Monitorear relaciones con comunidades',
        'Aprobar reportes de sostenibilidad'
      ],
      logros2025: [
        'Reducción del 15% en consumo de agua',
        'Implementación de programa de reforestación (5,000 árboles)',
        'Certificación Código Internacional de Manejo del Cianuro'
      ]
    },
    {
      nombre: 'Comité de Riesgos',
      presidente: '[Nombre Director]',
      miembros: 3,
      frecuencia: 'Reuniones mensuales',
      responsabilidades: [
        'Identificar y evaluar riesgos estratégicos y operacionales',
        'Supervisar matriz de riesgos corporativos',
        'Aprobar políticas de gestión de riesgos',
        'Monitorear exposición a riesgos financieros',
        'Revisar planes de continuidad del negocio'
      ],
      logros2025: [
        'Actualización de matriz de riesgos con 45 riesgos identificados',
        'Implementación de plan de ciberseguridad',
        'Simulacro de emergencia minera con 98% de éxito'
      ]
    },
    {
      nombre: 'Comité de Compensación',
      presidente: '[Nombre Director Independiente]',
      miembros: 3,
      frecuencia: 'Reuniones semestrales',
      responsabilidades: [
        'Definir política de remuneración ejecutiva',
        'Aprobar compensación del CEO y ejecutivos clave',
        'Diseñar programas de incentivos de largo plazo',
        'Evaluar desempeño del equipo ejecutivo',
        'Garantizar competitividad salarial en el mercado'
      ],
      logros2025: [
        'Implementación de bonos por objetivos ESG',
        'Estudio de benchmarking salarial sectorial',
        'Plan de sucesión para posiciones críticas'
      ]
    }
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
      await this.galleryService.initializeForSection(SECTION_FOLDERS.EMPRESA);
      
      const allImages = this.galleryService.getAllImages();
      
      if (allImages.length > 0) {
        // Hero image - landscape
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });

        if (!this.heroImage && allImages.length > 0) {
          this.heroImage = allImages[0];
        }
        
        // Gallery images - hasta 4 imágenes
        this.galleryImages = allImages.slice(0, 4);
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

  getTendenciaIcon(tendencia: string): string {
    switch (tendencia) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  }

  getTendenciaColor(tendencia: string): string {
    switch (tendencia) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-400';
    }
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