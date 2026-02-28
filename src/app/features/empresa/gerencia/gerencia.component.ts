import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-gerencia',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.scss']
})
export class GerenciaComponent {
  ejecutivos = [
    {
      nombre: 'Juan Carlos Rodríguez',
      cargo: 'Director General',
      foto: 'https://i.pravatar.cc/300?img=12',
      bio: 'Más de 20 años de experiencia en gestión minera. Ingeniero de Minas con especialización en desarrollo sostenible.',
      email: 'jrodriguez@transparenciaminera.ec',
      linkedin: '#'
    },
    {
      nombre: 'María Elena Suárez',
      cargo: 'Directora de Operaciones',
      foto: 'https://i.pravatar.cc/300?img=45',
      bio: 'Experta en optimización de procesos mineros y gestión de seguridad industrial.',
      email: 'msuarez@transparenciaminera.ec',
      linkedin: '#'
    },
    {
      nombre: 'Carlos Mendoza',
      cargo: 'Director Financiero',
      foto: 'https://i.pravatar.cc/300?img=33',
      bio: 'Contador público con MBA en finanzas corporativas. Especialista en auditoría y compliance.',
      email: 'cmendoza@transparenciaminera.ec',
      linkedin: '#'
    },
    {
      nombre: 'Ana Patricia Torres',
      cargo: 'Directora de Sostenibilidad',
      foto: 'https://i.pravatar.cc/300?img=47',
      bio: 'Ingeniera ambiental dedicada a la implementación de prácticas mineras responsables.',
      email: 'atorres@transparenciaminera.ec',
      linkedin: '#'
    }
  ];
}
