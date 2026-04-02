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

interface Documento {
  titulo: string;
  categoria: 'Estatutario' | 'Normativo' | 'Informativo' | 'Financiero';
  descripcion: string;
  fechaVersion: string;
  paginas: number;
  tamano: string;
  idioma: string;
  urlDescarga: string;
}

@Component({
  selector: 'app-documentos-gobernanza',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  documentImages: CloudinaryImage[] = [];
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';

  documentos: Documento[] = [
    // ESTATUTARIOS
    {
      titulo: 'Estatutos Sociales',
      categoria: 'Estatutario',
      descripcion: 'Estatutos de la sociedad PLAMPROMIN S.A., incluyendo objeto social, capital, órganos de gobierno y normas de funcionamiento.',
      fechaVersion: 'Última reforma: Enero 2024',
      paginas: 45,
      tamano: '2.3 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Reglamento de Directorio',
      categoria: 'Estatutario',
      descripcion: 'Normas de funcionamiento del Consejo Directivo, atribuciones, periodicidad de reuniones, quórum y procedimientos de toma de decisiones.',
      fechaVersion: 'Vigente desde: Marzo 2024',
      paginas: 28,
      tamano: '1.5 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Reglamento de Asambleas',
      categoria: 'Estatutario',
      descripcion: 'Procedimientos para convocatoria, celebración y adopción de acuerdos en juntas generales de accionistas.',
      fechaVersion: 'Vigente desde: Enero 2024',
      paginas: 18,
      tamano: '980 KB',
      idioma: 'Español',
      urlDescarga: '#'
    },

    // NORMATIVOS
    {
      titulo: 'Código de Ética Corporativo',
      categoria: 'Normativo',
      descripcion: 'Principios y valores que guían la conducta de todos los colaboradores, directores y terceros vinculados a la empresa.',
      fechaVersion: 'Versión 3.0 - Febrero 2025',
      paginas: 32,
      tamano: '1.8 MB',
      idioma: 'Español / English',
      urlDescarga: '#'
    },
    {
      titulo: 'Manual de Gobierno Corporativo',
      categoria: 'Normativo',
      descripcion: 'Compilación integral de principios, políticas y procedimientos de gobierno corporativo de PLAMPROMIN S.A.',
      fechaVersion: 'Versión 2.0 - Marzo 2025',
      paginas: 68,
      tamano: '3.4 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Política de Conflictos de Interés',
      categoria: 'Normativo',
      descripcion: 'Procedimientos para identificar, declarar y gestionar situaciones de conflicto de interés en la organización.',
      fechaVersion: 'Vigente desde: Enero 2025',
      paginas: 15,
      tamano: '780 KB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Política de Transacciones con Partes Relacionadas',
      categoria: 'Normativo',
      descripcion: 'Marco normativo para aprobación y divulgación de transacciones con accionistas, directores y otras partes relacionadas.',
      fechaVersion: 'Vigente desde: Febrero 2025',
      paginas: 22,
      tamano: '1.1 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Política de Compensación de Directores y Ejecutivos',
      categoria: 'Normativo',
      descripcion: 'Criterios y mecanismos para determinar la remuneración de miembros del directorio y equipo ejecutivo.',
      fechaVersion: 'Vigente desde: Enero 2025',
      paginas: 19,
      tamano: '950 KB',
      idioma: 'Español',
      urlDescarga: '#'
    },

    // INFORMATIVOS
    {
      titulo: 'Informe Anual de Gobierno Corporativo 2025',
      categoria: 'Informativo',
      descripcion: 'Reporte detallado sobre estructura de gobierno, composición del directorio, reuniones realizadas y principales decisiones del año.',
      fechaVersion: 'Periodo: Enero - Diciembre 2025',
      paginas: 52,
      tamano: '4.2 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Memoria Anual a Accionistas 2025',
      categoria: 'Informativo',
      descripcion: 'Informe integral de gestión presentado a la junta general de accionistas, incluyendo resultados financieros y operacionales.',
      fechaVersion: 'Periodo: Enero - Diciembre 2025',
      paginas: 88,
      tamano: '8.5 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Reporte de Cumplimiento Normativo 2025',
      categoria: 'Informativo',
      descripcion: 'Documento que evidencia el cumplimiento de regulaciones mineras, ambientales, laborales y tributarias aplicables.',
      fechaVersion: 'Periodo: Enero - Diciembre 2025',
      paginas: 45,
      tamano: '3.8 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },

    // FINANCIEROS
    {
      titulo: 'Estados Financieros Auditados 2025',
      categoria: 'Financiero',
      descripcion: 'Estados financieros auditados por firma independiente, con opinión de auditoría y notas explicativas completas.',
      fechaVersion: 'Auditados al: 31 de Diciembre 2025',
      paginas: 72,
      tamano: '5.6 MB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Informe de Auditoría Independiente 2025',
      categoria: 'Financiero',
      descripcion: 'Opinión de los auditores externos sobre la razonabilidad de los estados financieros y controles internos.',
      fechaVersion: 'Fecha: 15 de Marzo 2026',
      paginas: 8,
      tamano: '640 KB',
      idioma: 'Español',
      urlDescarga: '#'
    },
    {
      titulo: 'Política de Dividendos',
      categoria: 'Financiero',
      descripcion: 'Criterios para la distribución de utilidades entre accionistas, considerando necesidades de inversión y liquidez.',
      fechaVersion: 'Vigente desde: Enero 2024',
      paginas: 12,
      tamano: '720 KB',
      idioma: 'Español',
      urlDescarga: '#'
    }
  ];

  // Agrupar documentos por categoría
  get documentosEstatutarios(): Documento[] {
    return this.documentos.filter(d => d.categoria === 'Estatutario');
  }

  get documentosNormativos(): Documento[] {
    return this.documentos.filter(d => d.categoria === 'Normativo');
  }

  get documentosInformativos(): Documento[] {
    return this.documentos.filter(d => d.categoria === 'Informativo');
  }

  get documentosFinancieros(): Documento[] {
    return this.documentos.filter(d => d.categoria === 'Financiero');
  }

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
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });

        if (!this.heroImage && allImages.length > 0) {
          this.heroImage = allImages[0];
        }
        
        this.documentImages = allImages.slice(0, 3);
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

  getCategoriaColor(categoria: string): string {
    switch (categoria) {
      case 'Estatutario': return 'bg-blue-600/20 text-blue-600';
      case 'Normativo': return 'bg-orange-600/20 text-orange-600';
      case 'Informativo': return 'bg-green-600/20 text-green-600';
      case 'Financiero': return 'bg-purple-600/20 text-purple-600';
      default: return 'bg-gray-600/20 text-gray-600';
    }
  }

  descargarDocumento(doc: Documento): void {
    // Implementar lógica de descarga
    console.log('Descargando:', doc.titulo);
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