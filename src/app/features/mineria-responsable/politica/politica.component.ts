import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-politica',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.scss']
})
export class PoliticaComponent {
  compromisos = [
    { titulo: 'Prevención sobre corrección', texto: 'Identificamos y controlamos los riesgos antes de que se materialicen, aplicando la jerarquía de controles en todos los procesos operativos.' },
    { titulo: 'Cumplimiento legal y normativo', texto: 'Cumplimos y superamos los requisitos legales de Ecuador en materia ambiental, laboral y minera, así como los estándares internacionales voluntarios adoptados.' },
    { titulo: 'Mejora continua', texto: 'Establecemos objetivos y metas medibles, revisamos nuestro desempeño periódicamente y adoptamos mejores prácticas de la industria minera responsable.' },
    { titulo: 'Participación activa', texto: 'Involucramos a todos nuestros colaboradores, contratistas y comunidades en la cultura QHSE, fomentando la comunicación abierta y el reporte de condiciones inseguras.' },
    { titulo: 'Responsabilidad compartida', texto: 'Cada miembro de la organización, desde el Directorio hasta el operador de frente, es responsable de aplicar y defender esta política en su ámbito de acción.' },
  ];
}