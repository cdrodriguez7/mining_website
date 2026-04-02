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

  openPreview(url: string, title: string): void {
    this.previewUrl   = url;
    this.previewTitle = title;
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
  }

  destacados = [
    {
      nombre: 'Juan Carlos Rodríguez Vega',
      cargo: 'Gerente General',
      area: 'Dirección Ejecutiva',
      experiencia: '22 años',
      foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&fit=crop&crop=faces,top',
      trayectoria: 'Ingeniero de Minas por la ESPOL. Lideró la obtención del EIA institucional ante el MAATE, la implementación del sistema QHSE corporativo y la expansión de la planta de beneficio a 220 t/día. Miembro del Directorio Técnico de la Cámara de Minería del Ecuador.',
      certificaciones: ['MBA — Universidad Andina Simón Bolívar', 'Ing. Minas ESPOL — Promoción 2002', 'Certificado CRIRSCO — Recursos Minerales'],
      especialidades: ['Planificación minera estratégica', 'Gestión de proyectos EPC', 'Relaciones con organismos de control', 'Liderazgo de equipos técnicos'],
      email: 'jrodriguez@plampromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'María Elena Suárez Montoya',
      cargo: 'Gerente de Operaciones',
      area: 'Operaciones Mineras',
      experiencia: '16 años',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop&crop=faces,top',
      trayectoria: 'Ingeniera Geóloga con especialización en Minería a Cielo Abierto. Supervisó la ampliación de la planta de beneficio y el diseño del sistema de relaves. Docente invitada en la Universidad de Cuenca. Anteriormente en Kinross Gold Ecuador y CODELCO Chile.',
      certificaciones: ['Ing. Geóloga — Universidad de Cuenca', 'MSc. Ingeniería de Minas — U. de Chile', 'Certificación PERC — Exploración Europa'],
      especialidades: ['Optimización de plantas de beneficio', 'Diseño de sistemas de relaves', 'Planificación de pit a largo plazo', 'Control de dilución y recuperación'],
      email: 'msuarez@plampromin.ec',
      linkedin: '#'
    }
  ];

  equipo = [
    {
      nombre: 'Carlos Mendoza Alvarado',
      cargo: 'Gerente Financiero',
      area: 'Finanzas y Administración',
      experiencia: '14 años',
      foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&fit=crop&crop=faces,top',
      bio: 'CPA con MBA en Finanzas Corporativas (USFQ). Especialista en estructuración financiera de proyectos mineros, compliance tributario y auditoría.',
      especialidades: ['Finanzas corporativas', 'Auditoría y compliance', 'Gestión de riesgos financieros'],
      email: 'cmendoza@plampromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Ana Patricia Torres Ríos',
      cargo: 'Gerente QHSE',
      area: 'Seguridad, Salud y Ambiente',
      experiencia: '12 años',
      foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop&crop=faces,top',
      bio: 'Ingeniera Ambiental (FLACSO). Arquitecta del sistema ISO 14001 de PLAMPROMIN. Responsable del programa de 0 fatalidades, activo por tercer año consecutivo.',
      especialidades: ['ISO 14001 / ISO 45001', 'Gestión de emergencias', 'Monitoreo ambiental'],
      email: 'atorres@plampromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Roberto Espinoza Castillo',
      cargo: 'Gerente de Geología',
      area: 'Exploración y Recursos',
      experiencia: '18 años',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fit=crop&crop=faces,top',
      bio: 'Doctor en Ciencias Geológicas (U. Complutense de Madrid). Dirige la estimación de recursos minerales y los programas de exploración en el cinturón aurífero del Azuay.',
      especialidades: ['Exploración de recursos auríferos', 'Modelado geológico 3D', 'Estimación de reservas (NI 43-101)'],
      email: 'respinoza@plampromin.ec',
      linkedin: '#'
    },
    {
      nombre: 'Diana Lucía Herrera Pino',
      cargo: 'Gerente de Relaciones Comunitarias',
      area: 'Comunidades y RSE',
      experiencia: '10 años',
      foto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&fit=crop&crop=faces,top',
      bio: 'Socióloga especializada en Desarrollo Comunitario y Consulta Previa. Gestiona la inversión social en las 8 comunidades del área de influencia del proyecto.',
      especialidades: ['Consulta previa libre e informada', 'Programas de inversión social', 'Gestión de conflictos sociales'],
      email: 'dherrera@plampromin.ec',
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
