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
  descripcion: string;
  fecha: string;
  tamano: string;
  /** ID del archivo en Google Drive. Reemplazar tras subir el archivo. */
  driveFileId: string;
}

interface CategoriaDocumental {
  id: string;
  nombre: string;
  subtitulo: string;
  /** Color base de Tailwind: 'amber' | 'blue' | 'purple' | 'green' | 'orange' */
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  hoverBorderClass: string;
  hoverTextClass: string;
  iconPath: string;
  documentos: Documento[];
}

const DRIVE_DOWNLOAD = (id: string) =>
  `https://drive.google.com/uc?export=download&id=${id}`;

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

  readonly categorias: CategoriaDocumental[] = [
    {
      id: 'titulo-minero',
      nombre: 'Título Minero',
      subtitulo: 'Registro oficial de derechos mineros otorgados por el Estado',
      color: 'amber',
      bgClass: 'bg-amber-600/20',
      textClass: 'text-amber-500',
      borderClass: 'border-amber-600/30',
      hoverBorderClass: 'hover:border-amber-500',
      hoverTextClass: 'group-hover:text-amber-500',
      iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      documentos: [
        {
          titulo: 'Registro Minero Planta 1000 Toneladas',
          descripcion: 'Registro oficial ante el Ministerio de Energía y Minas que acredita el título minero de la planta de beneficio PLANPROMIN SA con capacidad de 1000 toneladas.',
          fecha: '2024',
          tamano: '2.1 MB',
          driveFileId: '1us3o-t_5-xPQuuc0h4RwRCuRcjt2XUQa'
        }
      ]
    },
    {
      id: 'permiso-planta',
      nombre: 'Permiso de Planta',
      subtitulo: 'Autorizaciones ministeriales para instalación y operación de la planta de beneficio',
      color: 'blue',
      bgClass: 'bg-blue-600/20',
      textClass: 'text-blue-500',
      borderClass: 'border-blue-600/30',
      hoverBorderClass: 'hover:border-blue-500',
      hoverTextClass: 'group-hover:text-blue-500',
      iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      documentos: [
        {
          titulo: 'Resolución de Autorización de Planta de Beneficio',
          descripcion: 'Resolución MEM-CZCS-2024-0026-RM emitida por el Ministerio de Energía y Minas que otorga la autorización de instalación y operación de la Planta de Beneficio PLANPROMIN SA, código 10000922.',
          fecha: '20 de febrero de 2024',
          tamano: '141 KB',
          driveFileId: '1d8vALLIIsXDVncSF0Oy4ZRwuTigEe3jM'
        },
        {
          titulo: 'Rectificación a Resolución de Autorización de Planta de Beneficio',
          descripcion: 'Resolución MEM-CZCS-2024-0031-RM que aclara y rectifica la resolución de otorgamiento original para la Planta de Beneficio PLANPROMIN SA, código 10000922.',
          fecha: '21 de febrero de 2024',
          tamano: '134 KB',
          driveFileId: '1SSkn9BX5OurF_M6lHuzNOJhLfupDdic1'
        },
        {
          titulo: 'Contrato de Cesión de Derechos de Uso Planta Lajo',
          descripcion: 'Contrato mediante el cual MANEOS PROYECTOS S.A.S. cede a PLANPROMIN S.A. todos los derechos y obligaciones adquiridos sobre la Planta de Beneficio Lajo (400 T/día), incluyendo servidumbre de acceso y uso.',
          fecha: 'Septiembre 2024',
          tamano: '160 KB',
          driveFileId: '1-075HBi0MzXdFu8nLFz2X4Vl5e1aIoAA'
        },
        {
          titulo: 'Escritura de Habilitación Planta PLANPROMIN',
          descripcion: 'Escritura pública que formaliza la habilitación legal de las instalaciones de la planta de beneficio de PLANPROMIN SA ante notaría pública.',
          fecha: '2024',
          tamano: '12.6 MB',
          driveFileId: '1FAdYzhKMYvTOTlrXWOppShgpe_Cc1XN7'
        }
      ]
    },
    {
      id: 'declaracion-juramentada',
      nombre: 'Declaración Juramentada',
      subtitulo: 'Declaraciones notariales bajo juramento del representante legal',
      color: 'purple',
      bgClass: 'bg-purple-600/20',
      textClass: 'text-purple-500',
      borderClass: 'border-purple-600/30',
      hoverBorderClass: 'hover:border-purple-500',
      hoverTextClass: 'group-hover:text-purple-500',
      iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      documentos: [
        {
          titulo: 'Declaración Juramentada de No Afectación - PLANPROMIN SA',
          descripcion: 'Escritura pública No. 2026-09-01016P00205 otorgada ante Notaría XVI del Cantón Guayaquil por el Gerente General Gonzalo Agustín Paez Parral, en representación de PLANPROMIN SA, declarando bajo juramento la no afectación a terceros.',
          fecha: '15 de enero de 2026',
          tamano: '4.5 MB',
          driveFileId: '1BZO6xYDvZJLpXKIsOlP7dqWb-ZYUGN8P'
        }
      ]
    },
    {
      id: 'certificado-ambiental',
      nombre: 'Certificado Ambiental',
      subtitulo: 'Certificaciones y registros ambientales otorgados por el MAATE',
      color: 'green',
      bgClass: 'bg-green-600/20',
      textClass: 'text-green-500',
      borderClass: 'border-green-600/30',
      hoverBorderClass: 'hover:border-green-500',
      hoverTextClass: 'group-hover:text-green-500',
      iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      documentos: [
        {
          titulo: 'Certificado de Intersección SNAP - MAATE 2025',
          descripcion: 'Certificado MAATE-SUIA-RA-DZDA-2025-01613 que acredita que el proyecto "Sistema Integral de Reprocesamiento de Relaves y Operación de Planta de Beneficio PLANPROMIN SA" NO interseca con el Sistema Nacional de Áreas Protegidas (SNAP), Patrimonio Forestal ni Zonas Intangibles. Impacto calificado como ALTO, requiere Licencia Ambiental.',
          fecha: '28 de mayo de 2025',
          tamano: '170 KB',
          driveFileId: '1bRu_jI0laooJ5Kt8vPW8nEyRd2aoj67c'
        },
        {
          titulo: 'Registro Provisional de Generador de Desechos Peligrosos',
          descripcion: 'Registro No. SUIA-11-2025-MAE-OTSI-DZDA-RGD-0013-PROVISIONAL otorgado por el MAATE que habilita a PLANPROMIN SA como generador de residuos y desechos peligrosos y/o especiales, incluyendo relaves con cianuro/mercurio y aceites industriales.',
          fecha: '21 de noviembre de 2025',
          tamano: '525 KB',
          driveFileId: '1vLQw_Tt0Uon-pMqmzrHLq1ZDicT9-8FX'
        },
        {
          titulo: 'Reporte de Información Preliminar SUIA',
          descripcion: 'Resumen del registro del proyecto código MAATE-RA-2025-556193 en el Sistema Único de Información Ambiental. Constituye el paso inicial del proceso de Regularización Ambiental ante la Dirección de Regularización Ambiental del MAATE.',
          fecha: '28 de mayo de 2025',
          tamano: '451 KB',
          driveFileId: '1qa03eA9r5ujGWCEzYGNxpOHV4Re-i1vp'
        }
      ]
    },
    {
      id: 'proceso-relaveras',
      nombre: 'Proceso de Relaveras',
      subtitulo: 'Contratos y escrituras que rigen el proceso de gestión y disposición de relaves',
      color: 'orange',
      bgClass: 'bg-orange-600/20',
      textClass: 'text-orange-500',
      borderClass: 'border-orange-600/30',
      hoverBorderClass: 'hover:border-orange-500',
      hoverTextClass: 'group-hover:text-orange-500',
      iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      documentos: [
        {
          titulo: 'Escritura de Comodato Planta Lajo - Colorado Mining a MANEOS Proyectos',
          descripcion: 'Escritura pública No. 20240901016P04472 celebrada ante Notaría XVI del Cantón Guayaquil. COLORADO MINING COLMINING S.A. otorga en comodato a MANEOS PROYECTOS S.A.S. la Planta de Beneficio Lajo para procesamiento de minerales hasta 400 T/día, base de la cadena contractual de operación de relaveras.',
          fecha: '10 de julio de 2024',
          tamano: '12 MB',
          driveFileId: '1h4ucqhWmfShzcL1YaQhCJsmDDiI2Gpf7'
        }
      ]
    }
  ];

  get totalDocumentos(): number {
    return this.categorias.reduce((sum, cat) => sum + cat.documentos.length, 0);
  }

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
      await this.galleryService.initializeForSection(SECTION_FOLDERS.EMPRESA);
      const allImages = this.galleryService.getAllImages();
      if (allImages.length > 0) {
        this.heroImage = this.imageSelectorService.selectImage(allImages, {
          aspectRatio: 'landscape',
          minWidth: 800
        });
        if (!this.heroImage) this.heroImage = allImages[0];
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

  descargarDocumento(doc: Documento): void {
    if (!doc.driveFileId) {
      console.warn('Documento pendiente de subir a Google Drive:', doc.titulo);
      return;
    }
    const url = DRIVE_DOWNLOAD(doc.driveFileId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  estaDisponible(doc: Documento): boolean {
    return !!doc.driveFileId;
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
