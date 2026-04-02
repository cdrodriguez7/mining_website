import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../../core/models/gallery.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

interface CanalContacto {
  tipo: string;
  icono: string;
  detalle: string;
  disponibilidad: string;
  anonimo: boolean;
}

interface Denuncia {
  tipoDenuncia: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  testigos: string;
  evidencia: string;
  denuncianteNombre: string;
  denuncianteEmail: string;
  denuncianteTelefono: string;
  anonima: boolean;
}

@Component({
  selector: 'app-canal-denuncias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './denuncias.component.html',
  styleUrls: ['./denuncias.component.scss']
})
export class DenunciasComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  
  // Estado del formulario
  showForm = false;
  formSubmitted = false;
  
  denuncia: Denuncia = {
    tipoDenuncia: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    testigos: '',
    evidencia: '',
    denuncianteNombre: '',
    denuncianteEmail: '',
    denuncianteTelefono: '',
    anonima: false
  };

  tiposDenuncia = [
    'Corrupción o soborno',
    'Fraude financiero',
    'Conflicto de interés no declarado',
    'Acoso laboral o sexual',
    'Discriminación',
    'Violación de políticas de seguridad',
    'Daño ambiental',
    'Robo o malversación de fondos',
    'Uso indebido de información confidencial',
    'Otro'
  ];

  canalesContacto: CanalContacto[] = [
    {
      tipo: 'Línea Telefónica',
      icono: '📞',
      detalle: '+593-XX-XXX-XXXX',
      disponibilidad: '24/7',
      anonimo: true
    },
    {
      tipo: 'Correo Electrónico',
      icono: '✉️',
      detalle: 'denuncias@plampromin.com',
      disponibilidad: 'Respuesta en 48h',
      anonimo: true
    },
    {
      tipo: 'Formulario Web',
      icono: '🌐',
      detalle: 'Sistema seguro y encriptado',
      disponibilidad: '24/7',
      anonimo: true
    }
  ];

  garantias = [
    {
      titulo: 'Confidencialidad Absoluta',
      descripcion: 'Toda información recibida es tratada con estricta confidencialidad',
      icono: ''
    },
    {
      titulo: 'Anonimato Garantizado',
      descripcion: 'No es necesario identificarse. Su identidad nunca será revelada',
      icono: ''
    },
    {
      titulo: 'No Represalias',
      descripcion: 'Prohibición absoluta de tomar represalias contra denunciantes',
      icono: ''
    },
    {
      titulo: 'Investigación Objetiva',
      descripcion: 'Todas las denuncias son investigadas de manera imparcial',
      icono: ''
    },
    {
      titulo: 'Seguimiento del Caso',
      descripcion: 'Código de seguimiento para monitorear el estado de su denuncia',
      icono: ''
    },
    {
      titulo: 'Acciones Correctivas',
      descripcion: 'Se toman medidas inmediatas para corregir situaciones identificadas',
      icono: ''
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
        this.heroImage = this.imageSelectorService.selectImage(allImages, { 
          aspectRatio: 'landscape',
          minWidth: 800
        });
      }
      
if (!this.heroImage && allImages.length > 0) {
  this.heroImage = allImages[0];
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

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onAnonimaChange(): void {
    if (this.denuncia.anonima) {
      this.denuncia.denuncianteNombre = '';
      this.denuncia.denuncianteEmail = '';
      this.denuncia.denuncianteTelefono = '';
    }
  }

  enviarDenuncia(): void {
    // Validación básica
    if (!this.denuncia.tipoDenuncia || !this.denuncia.descripcion) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Aquí iría la lógica para enviar al backend
    console.log('Denuncia enviada:', this.denuncia);
    
    this.formSubmitted = true;
    this.showForm = false;
    
    // Generar código de seguimiento
    const codigoSeguimiento = 'DEN-' + Date.now().toString().slice(-8);
    alert(`Denuncia registrada exitosamente.\n\nCódigo de seguimiento: ${codigoSeguimiento}\n\nGuarde este código para consultar el estado de su denuncia.`);
    
    // Reset form
    this.resetForm();
  }

  resetForm(): void {
    this.denuncia = {
      tipoDenuncia: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      testigos: '',
      evidencia: '',
      denuncianteNombre: '',
      denuncianteEmail: '',
      denuncianteTelefono: '',
      anonima: false
    };
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