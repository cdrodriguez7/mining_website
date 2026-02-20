import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent {
  anos = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  
  noticiasRecientes = [
    {
      titulo: 'Resultados del Q4 2024 superan expectativas',
      fecha: '2025-02-15',
      categoria: 'Resultados Financieros',
      resumen: 'La compañía reporta un aumento del 15% en la producción trimestral de oro...',
      ano: 2025
    },
    {
      titulo: 'Nueva inversión en tecnología de exploración',
      fecha: '2025-01-28',
      categoria: 'Inversiones',
      resumen: 'Se destinan $5M para equipos de última generación en exploración...',
      ano: 2025
    },
    {
      titulo: 'Certificación ISO 14001 renovada',
      fecha: '2024-12-10',
      categoria: 'Sostenibilidad',
      resumen: 'Auditoría confirma cumplimiento de estándares ambientales internacionales...',
      ano: 2024
    }
  ];
}
