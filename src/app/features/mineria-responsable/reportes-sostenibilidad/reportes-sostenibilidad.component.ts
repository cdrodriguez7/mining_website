import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-reportes-sostenibilidad',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './reportes-sostenibilidad.component.html',
  styleUrls: ['./reportes-sostenibilidad.component.scss']
})
export class ReportesSostenibilidadComponent {
  reportes = [
    { titulo: 'Reporte de Sostenibilidad 2024', subtitulo: 'GRI Standards 2021 · Verificado por tercero independiente', paginas: '68 págs.', estado: 'Publicado' },
    { titulo: 'Reporte de Sostenibilidad 2023', subtitulo: 'GRI Standards 2021 · Primer reporte verificado externamente', paginas: '54 págs.', estado: 'Publicado' },
    { titulo: 'Reporte de Sostenibilidad 2022', subtitulo: 'GRI Standards · Línea base para estrategia 2026–2030', paginas: '48 págs.', estado: 'Publicado' },
    { titulo: 'Reporte de Sostenibilidad 2021', subtitulo: 'Primer reporte de sostenibilidad de PLAMPROMIN', paginas: '36 págs.', estado: 'Publicado' },
  ];
}