import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.scss']
})
export class DirectorioComponent {
  directores = [
    {
      nombre: 'Ing. Patricio Armijos Salcedo',
      cargo: 'Presidente del Directorio',
      tipo: 'Independiente',
      desde: '2014',
      comites: ['Comité Ejecutivo', 'Comité de Auditoría'],
      bio: 'Ingeniero de Minas con más de 35 años en el sector minero andino. Ex-Subsecretario de Minas del Ministerio de Recursos Naturales No Renovables del Ecuador. Doctor Honoris Causa por la Universidad Central del Ecuador.',
      iniciales: 'PA'
    },
    {
      nombre: 'Eco. Verónica Salinas Mora',
      cargo: 'Vicepresidenta del Directorio',
      tipo: 'Representante Principal',
      desde: '2018',
      comites: ['Comité Ejecutivo', 'Comité de Compensación'],
      bio: 'Economista con maestría en Finanzas Internacionales por la Universidad de Columbia. Socia fundadora de Salinas & Asociados Consulting. Especialista en estructura de capital para proyectos de recursos naturales.',
      iniciales: 'VS'
    },
    {
      nombre: 'Dr. Luis Fernando Cárdenas',
      cargo: 'Director Principal',
      tipo: 'Independiente',
      desde: '2016',
      comites: ['Comité de Auditoría', 'Comité de Riesgos'],
      bio: 'Abogado corporativo con doctorado en Derecho Ambiental Internacional. Ex-director de la Agencia de Regulación y Control Minero (ARCOM). Árbitro certificado de la Cámara de Comercio de Guayaquil.',
      iniciales: 'LC'
    },
    {
      nombre: 'Ing. Carmen Delgado Vargas',
      cargo: 'Directora Principal',
      tipo: 'Representante Principal',
      desde: '2020',
      comites: ['Comité de Sostenibilidad', 'Comité de Compensación'],
      bio: 'Ingeniera Ambiental con especialización en Gestión de Recursos Hídricos por la Universidad de Ginebra. Consultora sénior para proyectos mineros en Colombia, Perú y Ecuador. Experta en EIA y normas IFC.',
      iniciales: 'CD'
    },
    {
      nombre: 'MBA. Roberto Andrade Peña',
      cargo: 'Director Suplente',
      tipo: 'Representante Suplente',
      desde: '2021',
      comites: ['Comité de Riesgos'],
      bio: 'MBA por el INCAE Business School. Especialista en gestión de riesgos operativos en industrias extractivas. Anteriormente director de operaciones en Kinross Gold Ecuador y Codelco Chile.',
      iniciales: 'RA'
    },
    {
      nombre: 'Lcda. Sofía Ochoa Briones',
      cargo: 'Secretaria del Directorio',
      tipo: 'Secretaría',
      desde: '2019',
      comites: ['Comité Ejecutivo'],
      bio: 'Abogada corporativa con LLM en Derecho Societario. Responsable de la custodia de actas, libros corporativos y coordinación de sesiones del Directorio y la Junta General de Accionistas de PLAMPROMIN.',
      iniciales: 'SO'
    }
  ];

  comites = [
    {
      nombre: 'Comité Ejecutivo',
      desc: 'Supervisa la estrategia corporativa y aprueba decisiones de inversión superiores a USD 500.000.',
      miembros: 3
    },
    {
      nombre: 'Comité de Auditoría',
      desc: 'Revisa los estados financieros, informes de auditoría interna y gestión de compliance.',
      miembros: 2
    },
    {
      nombre: 'Comité de Riesgos',
      desc: 'Monitorea el mapa de riesgos corporativos, operativos, ambientales y reputacionales.',
      miembros: 2
    },
    {
      nombre: 'Comité de Sostenibilidad',
      desc: 'Aprueba los objetivos ESG, reportes de sostenibilidad y política de comunidades.',
      miembros: 2
    },
    {
      nombre: 'Comité de Compensación',
      desc: 'Define la política de remuneración ejecutiva y evaluación de desempeño del Gerente General.',
      miembros: 2
    }
  ];
}
