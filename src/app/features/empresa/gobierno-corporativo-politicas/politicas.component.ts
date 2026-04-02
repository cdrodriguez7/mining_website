import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../../core/services/cloudinary.services';
import { GalleryService } from '../../../core/services/gallery.service';
import { ImageSelectorService } from '../../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../../core/models/gallery.model';

interface Politica {
  titulo: string;
  categoria: 'Ética' | 'Financiera' | 'Operacional' | 'Sostenibilidad' | 'Laboral';
  descripcion: string;
  alcance: string;
  objetivos: string[];
  principios: string[];
  responsable: string;
  revision: string;
  urlDocumento: string;
}

@Component({
  selector: 'app-politicas-centrales',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.scss']
})
export class PoliticasComponent implements OnInit {
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  policyImages: CloudinaryImage[] = [];

  politicas: Politica[] = [
    // POLÍTICAS ÉTICAS
    {
      titulo: 'Política Anticorrupción y Antisoborno',
      categoria: 'Ética',
      descripcion: 'Compromiso de cero tolerancia ante cualquier forma de corrupción, soborno, extorsión o prácticas ilícitas en todas nuestras operaciones.',
      alcance: 'Directores, ejecutivos, empleados, contratistas, proveedores y socios comerciales',
      objetivos: [
        'Prevenir, detectar y sancionar actos de corrupción',
        'Cumplir con la legislación anticorrupción nacional e internacional',
        'Promover cultura de integridad y transparencia',
        'Proteger la reputación corporativa'
      ],
      principios: [
        'Cero tolerancia a la corrupción en cualquier forma',
        'Prohibición absoluta de pagos de facilitación',
        'Debida diligencia con terceros',
        'Registros contables precisos y completos',
        'Capacitación continua en temas anticorrupción'
      ],
      responsable: 'Oficial de Cumplimiento',
      revision: 'Anual',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Conflictos de Interés',
      categoria: 'Ética',
      descripcion: 'Procedimientos para identificar, declarar, gestionar y resolver situaciones donde intereses personales puedan comprometer decisiones corporativas.',
      alcance: 'Todo el personal de PLAMPROMIN S.A.',
      objetivos: [
        'Identificar conflictos de interés reales o potenciales',
        'Establecer mecanismos de declaración obligatoria',
        'Garantizar toma de decisiones objetivas',
        'Prevenir situaciones que comprometan la integridad'
      ],
      principios: [
        'Declaración anual obligatoria de conflictos',
        'Abstención de decisiones cuando existe conflicto',
        'Transparencia en relaciones con partes relacionadas',
        'Evaluación caso por caso por el Comité de Ética',
        'Sanciones por ocultamiento de conflictos'
      ],
      responsable: 'Comité de Ética',
      revision: 'Anual',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Protección de Datos Personales',
      categoria: 'Ética',
      descripcion: 'Lineamientos para la recolección, uso, almacenamiento y protección de datos personales de empleados, clientes y terceros.',
      alcance: 'Todos los procesos que involucren datos personales',
      objetivos: [
        'Cumplir con Ley Orgánica de Protección de Datos Personales',
        'Garantizar privacidad y confidencialidad de datos',
        'Implementar medidas técnicas de seguridad',
        'Respetar derechos de titulares de datos'
      ],
      principios: [
        'Consentimiento informado para tratamiento de datos',
        'Finalidad legítima y específica',
        'Minimización de datos recolectados',
        'Seguridad mediante cifrado y controles de acceso',
        'Derecho de acceso, rectificación y eliminación'
      ],
      responsable: 'Oficial de Protección de Datos',
      revision: 'Anual',
      urlDocumento: '#'
    },

    // POLÍTICAS FINANCIERAS
    {
      titulo: 'Política de Gestión de Riesgos Financieros',
      categoria: 'Financiera',
      descripcion: 'Marco para identificar, medir, monitorear y mitigar riesgos financieros (mercado, crédito, liquidez, operacionales).',
      alcance: 'Todas las áreas con exposición a riesgos financieros',
      objetivos: [
        'Identificar riesgos financieros materiales',
        'Establecer límites de exposición aceptable',
        'Implementar estrategias de mitigación',
        'Monitorear riesgos en tiempo real'
      ],
      principios: [
        'Diversificación de inversiones y exposiciones',
        'Cobertura de riesgos cambiarios y de precio',
        'Límites claros de apalancamiento financiero',
        'Evaluación continua de riesgos emergentes',
        'Reportes trimestrales al Comité de Riesgos'
      ],
      responsable: 'Director Financiero',
      revision: 'Semestral',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Inversiones y Financiamiento',
      categoria: 'Financiera',
      descripcion: 'Criterios y procedimientos para la evaluación, aprobación y monitoreo de proyectos de inversión y fuentes de financiamiento.',
      alcance: 'Todas las inversiones mayores a USD 100,000',
      objetivos: [
        'Maximizar retorno ajustado por riesgo',
        'Mantener estructura de capital óptima',
        'Evaluar proyectos con criterios técnicos rigurosos',
        'Garantizar liquidez operacional'
      ],
      principios: [
        'Evaluación mediante VAN, TIR y periodo de recuperación',
        'Análisis de sensibilidad y escenarios',
        'Aprobación por Directorio para inversiones >USD 500K',
        'Ratio deuda/capital objetivo: 40/60',
        'Revisión post-inversión obligatoria'
      ],
      responsable: 'Comité de Inversiones',
      revision: 'Anual',
      urlDocumento: '#'
    },

    // POLÍTICAS OPERACIONALES
    {
      titulo: 'Política de Seguridad y Salud Ocupacional',
      categoria: 'Operacional',
      descripcion: 'Compromiso con la prevención de accidentes, enfermedades ocupacionales y promoción de ambientes de trabajo seguros.',
      alcance: 'Todas las operaciones mineras y administrativas',
      objetivos: [
        'Cero accidentes fatales y reducción de incidentes',
        'Cumplir ISO 45001:2018',
        'Cultura de seguridad en todos los niveles',
        'Respuesta efectiva ante emergencias'
      ],
      principios: [
        'La seguridad es responsabilidad de todos',
        'Derecho a rechazar trabajos inseguros',
        'Capacitación continua en seguridad',
        'Investigación de todos los incidentes',
        'Equipos de protección personal obligatorios'
      ],
      responsable: 'Gerente de Seguridad',
      revision: 'Anual',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Gestión de Contratistas y Proveedores',
      categoria: 'Operacional',
      descripcion: 'Lineamientos para selección, evaluación, contratación y monitoreo de contratistas y proveedores críticos.',
      alcance: 'Todos los procesos de adquisición y contratación',
      objetivos: [
        'Seleccionar proveedores calificados y éticos',
        'Garantizar cumplimiento de estándares de calidad',
        'Promover prácticas sostenibles en cadena de valor',
        'Mitigar riesgos de terceros'
      ],
      principios: [
        'Proceso de licitación competitivo y transparente',
        'Debida diligencia de integridad y capacidad técnica',
        'Cláusulas contractuales de cumplimiento ESG',
        'Evaluación anual de desempeño de proveedores',
        'Auditorías aleatorias a contratistas críticos'
      ],
      responsable: 'Gerente de Compras',
      revision: 'Anual',
      urlDocumento: '#'
    },

    // POLÍTICAS DE SOSTENIBILIDAD
    {
      titulo: 'Política Ambiental',
      categoria: 'Sostenibilidad',
      descripcion: 'Compromiso con la protección del medio ambiente, uso eficiente de recursos y prevención de la contaminación.',
      alcance: 'Todas las operaciones con impacto ambiental',
      objetivos: [
        'Cumplir legislación ambiental ecuatoriana',
        'Minimizar huella ambiental de operaciones',
        'Restaurar áreas afectadas por actividades mineras',
        'Obtener certificación ISO 14001:2015'
      ],
      principios: [
        'Prevención de contaminación en origen',
        'Uso eficiente de agua y energía',
        'Gestión adecuada de residuos peligrosos y no peligrosos',
        'Monitoreo continuo de emisiones y descargas',
        'Cierre progresivo y rehabilitación ambiental'
      ],
      responsable: 'Gerente Ambiental',
      revision: 'Anual',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Relaciones Comunitarias',
      categoria: 'Sostenibilidad',
      descripcion: 'Marco para establecer relaciones respetuosas, transparentes y mutuamente beneficiosas con comunidades de influencia.',
      alcance: 'Comunidades en área de influencia directa e indirecta',
      objetivos: [
        'Construir relaciones de confianza de largo plazo',
        'Contribuir al desarrollo local sostenible',
        'Gestionar impactos sociales de operaciones',
        'Respetar derechos de comunidades y pueblos'
      ],
      principios: [
        'Consulta previa, libre e informada',
        'Comunicación transparente y oportuna',
        'Contratación local preferencial',
        'Inversión social en educación, salud e infraestructura',
        'Mecanismos de quejas y reclamos accesibles'
      ],
      responsable: 'Gerente de Relaciones Comunitarias',
      revision: 'Anual',
      urlDocumento: '#'
    },

    // POLÍTICAS LABORALES
    {
      titulo: 'Política de Diversidad, Equidad e Inclusión',
      categoria: 'Laboral',
      descripcion: 'Compromiso con ambientes de trabajo diversos, equitativos e inclusivos, libres de discriminación y acoso.',
      alcance: 'Todos los procesos de recursos humanos',
      objetivos: [
        'Eliminar brechas salariales de género',
        'Incrementar participación femenina en minería',
        'Garantizar igualdad de oportunidades',
        'Prevenir discriminación y acoso'
      ],
      principios: [
        'Selección basada en mérito y competencias',
        'Cero tolerancia a discriminación por cualquier motivo',
        'Equiparación salarial para posiciones equivalentes',
        'Programas de desarrollo para grupos subrepresentados',
        'Protocolos de prevención y sanción de acoso'
      ],
      responsable: 'Gerente de Recursos Humanos',
      revision: 'Anual',
      urlDocumento: '#'
    },
    {
      titulo: 'Política de Capacitación y Desarrollo',
      categoria: 'Laboral',
      descripcion: 'Compromiso con el desarrollo continuo de competencias técnicas y blandas del capital humano.',
      alcance: 'Todo el personal de PLAMPROMIN S.A.',
      objetivos: [
        'Cerrar brechas de competencias identificadas',
        'Preparar sucesores para posiciones críticas',
        'Fomentar cultura de aprendizaje continuo',
        'Mejorar desempeño individual y organizacional'
      ],
      principios: [
        'Mínimo 40 horas de capacitación anual por persona',
        'Planes de desarrollo individuales',
        'Inversión del 2% de nómina en capacitación',
        'Evaluación de efectividad de capacitaciones',
        'Oportunidades de crecimiento interno'
      ],
      responsable: 'Gerente de Recursos Humanos',
      revision: 'Anual',
      urlDocumento: '#'
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

if (!this.heroImage && allImages.length > 0) {
  this.heroImage = allImages[0];
}
        
        this.policyImages = allImages.slice(0, 4);
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
      case 'Ética': return 'bg-blue-600/20 text-blue-600 border-blue-600';
      case 'Financiera': return 'bg-purple-600/20 text-purple-600 border-purple-600';
      case 'Operacional': return 'bg-orange-600/20 text-orange-600 border-orange-600';
      case 'Sostenibilidad': return 'bg-green-600/20 text-green-600 border-green-600';
      case 'Laboral': return 'bg-yellow-600/20 text-yellow-600 border-yellow-600';
      default: return 'bg-gray-600/20 text-gray-600 border-gray-600';
    }
  }

  getPoliticasPorCategoria(categoria: string): Politica[] {
    return this.politicas.filter(p => p.categoria === categoria);
  }
}