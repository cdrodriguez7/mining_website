import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-gerencia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ImagePreviewComponent],
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.scss']
})
export class GerenciaComponent {
  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  activeSlideIndex = 0;

  openPreview(url: string, title: string): void {
    this.previewUrl   = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }

  nextSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.destacados.length;
  }

  prevSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex - 1 + this.destacados.length) % this.destacados.length;
  }

  setSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  destacados = [
    {
      nombre: 'Sr. Marco Antonio Neves Osorio',
      cargo: 'Presidente',
      area: 'Presidencia',
      experiencia: 'Internacional',
      foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&fit=crop&crop=faces,top',
      trayectoria: 'Empresario portugués con destacada trayectoria internacional en minería, aviación, inversión corporativa, protección ejecutiva y cooperación humanitaria. Desarrolla su actividad entre Europa y América Latina. Es presidente de Planpromin S.A., impulsando importantes inversiones destinadas a incrementar la capacidad de producción y fortalecer el desarrollo sostenible de la industria minera ecuatoriana.',
      certificaciones: [
        'Civil Diplomat – Chaplain (Civil Diplomat Human and Humanitarian Committee)'
      ],
      especialidades: [
        'Inversión estratégica y corporativa (Colorado Mining, Osocorp)',
        'Aeronáutica corporativa (Centennials Helicópteros)',
        'Gestión de riesgos y seguridad (Sinergia)',
        'Responsabilidad social y cooperación bilateral Portugal-Ecuador'
      ],
      actividades: [
        'Múltiples iniciativas de cooperación comunitaria',
        'Apoyo a comunidades rurales e instituciones públicas',
        'Piloto de automovilismo deportivo en Portugal'
      ],
      email: 'mneves@planpromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Abg. Alberto Emilio Pincay Morla',
      cargo: 'Gerente General',
      area: 'Gerencia General',
      experiencia: '+25 años',
      foto: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev/assets/gerente_general_alberto.jpeg',
      trayectoria: 'Más de 25 años en libre ejercicio profesional. Ha destacado como Jefe del Departamento Jurídico en el Banco de Machala, así como profesor universitario y funcionario público en áreas afines a su profesión, aportando una sólida experiencia legal, corporativa y administrativa.',
      certificaciones: [
        'Abogado de los Tribunales y Juzgados de la República (UCSG, 2002)',
        'Magister en Derecho Constitucional (UEES, 2023)',
        'Magister en Administración de Empresas (UEES, 2026)'
      ],
      especialidades: [
        'Derecho Constitucional y Corporativo',
        'Asesoría Jurídica Empresarial',
        'Administración y Gestión Estratégica',
        'Gestión Pública y Privada'
      ],
      email: 'apincay@planpromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Ing. María Gracia Dueñas Condo',
      cargo: 'Directora del Departamento de Finanzas',
      area: 'Finanzas',
      experiencia: '+25 años',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop&crop=faces,top',
      trayectoria: 'Más de 25 años en libre ejercicio profesional en el área de finanzas y administración empresarial, aportando una sólida experiencia en gestión financiera, contabilidad y auditoría al equipo de PLANPROMIN.',
      certificaciones: [],
      especialidades: [
        'Gestión Financiera Empresarial',
        'Contabilidad y Auditoría',
        'Administración de Recursos',
        'Planificación Presupuestaria'
      ],
      actividades: [],
      email: 'mduenas@planpromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Ing. Gabriel Hipólito Lajo Morales',
      cargo: 'Project Manager',
      area: 'Gestión de Proyectos',
      experiencia: '+30 años',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=faces,top',
      trayectoria: 'Su trayectoria combina liderazgo técnico, innovación digital y gestión estratégica, orientada al desarrollo sostenible y la excelencia operativa en minería y metalurgia. Ingeniero Metalurgista con más de tres décadas de experiencia en dirección de plantas concentradoras, optimización de procesos metalúrgicos y gestión de proyectos mineros en Perú, Ecuador y Portugal.',
      certificaciones: [
        'Universidad Nacional de San Agustín de Arequipa, Perú',
        'Posgrado Fast Track MBA – Dirección de Empresas Mineras, Universidad de Antofagasta, Chile',
        'Máster en Transformación Digital e Industria 4.0, TECH Universidad Tecnológica, España'
      ],
      especialidades: [
        'Dirección de Plantas Concentradoras',
        'Optimización de Procesos Metalúrgicos',
        'Gestión de Proyectos Mineros',
        'Transformación Digital e Industria 4.0'
      ],
      actividades: [],
      email: 'glajo@planpromin.ec',
      linkedin: '#'
    }
  ];

  areas = [
    {
      nombre: 'Operaciones Mineras',
      desc: 'Extracción, voladura, acarreo y planta de beneficio · 220 t/día',
      icono: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      personas: 68
    },
    {
      nombre: 'Geología y Exploración',
      desc: 'Mapeo, perforación, análisis geoquímico y estimación de recursos',
      icono: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      personas: 14
    },
    {
      nombre: 'QHSE',
      desc: 'Seguridad industrial, salud ocupacional y gestión ambiental ISO 14001',
      icono: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      personas: 11
    },
    {
      nombre: 'Finanzas y Administración',
      desc: 'Contabilidad, tesorería, compras, nómina y auditoría interna',
      icono: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      personas: 9
    },
    {
      nombre: 'Relaciones Comunitarias',
      desc: 'Inversión social, consulta previa y relaciones con 8 comunidades',
      icono: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      personas: 8
    },
    {
      nombre: 'Legal y Cumplimiento',
      desc: 'Títulos mineros, normativa ARCOM, contratos y gobierno corporativo',
      icono: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      personas: 5
    }
  ];
}
