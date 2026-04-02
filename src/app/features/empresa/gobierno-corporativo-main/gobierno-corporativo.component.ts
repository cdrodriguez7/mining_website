import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-gobierno-corporativo',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './gobierno-corporativo.component.html',
  styleUrls: ['./gobierno-corporativo.component.scss']
})
export class GobiernoCorporativoComponent {
  subsecciones = [
    {
      titulo: 'Prácticas de Gobierno',
      desc: 'Principios, estructura y mecanismos de supervisión que rigen la toma de decisiones en PLAMPROMIN.',
      link: '/empresa/gobierno-corporativo/practicas',
      icono: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      badge: '4 pilares'
    },
    {
      titulo: 'Documentos Corporativos',
      desc: 'Estatutos, reglamentos, actas y documentación oficial de la sociedad disponibles para accionistas.',
      link: '/empresa/gobierno-corporativo/documentos',
      icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      badge: '4 categorías'
    },
    {
      titulo: 'Políticas Corporativas',
      desc: 'Código de Ética, política anticorrupción, política de privacidad y demás normas internas vigentes.',
      link: '/empresa/gobierno-corporativo/politicas',
      icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      badge: '5 políticas'
    },
    {
      titulo: 'Canal de Denuncias',
      desc: 'Sistema confidencial y anónimo para reportar conductas contrarias al Código de Ética institucional.',
      link: '/empresa/gobierno-corporativo/denuncias',
      icono: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      badge: 'Anónimo · Seguro'
    }
  ];

  estructura = [
    { nivel: '1', nombre: 'Junta General de Accionistas', desc: 'Órgano soberano. Aprueba estados financieros, distribución de utilidades y designa al Directorio.' },
    { nivel: '2', nombre: 'Directorio', desc: '6 miembros (2/3 independientes). Aprueba estrategia, supervisa riesgos y designa al Gerente General.' },
    { nivel: '3', nombre: 'Gerente General', desc: 'Ejecuta la estrategia aprobada por el Directorio y responde por los resultados operativos y financieros.' },
    { nivel: '4', nombre: 'Comités Especializados', desc: 'Auditoría, Riesgos, Sostenibilidad y Compensación — supervisión técnica en áreas específicas.' },
  ];
}
