import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss']
})
export class AcercaDeComponent {
  statistics = [
    { value: '83', label: 'Concesiones Activas', icon: '📋' },
    { value: '72%', label: 'Producción Nacional de Oro', icon: '🥇' },
    { value: '720+', label: 'Empleos Directos', icon: '👷' },
    { value: '15+', label: 'Años de Experiencia', icon: '⏱️' }
  ];

  valores = [
    {
      title: 'Transparencia',
      description: 'Promovemos la rendición de cuentas y el acceso público a información sobre operaciones mineras.',
      icon: '🔍'
    },
    {
      title: 'Sostenibilidad',
      description: 'Comprometidos con prácticas mineras responsables que protejan el medio ambiente.',
      icon: '🌱'
    },
    {
      title: 'Legalidad',
      description: 'Cumplimiento estricto de todas las regulaciones mineras y ambientales.',
      icon: '⚖️'
    },
    {
      title: 'Comunidad',
      description: 'Trabajamos en conjunto con las comunidades locales para el desarrollo sostenible.',
      icon: '🤝'
    }
  ];
}
