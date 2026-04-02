import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-impacto-ambiental',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './impacto-ambiental.component.html',
  styleUrls: ['./impacto-ambiental.component.scss']
})
export class ImpactoAmbientalComponent {
  componentes = [
    { titulo: 'Línea base ambiental', desc: 'Caracterización del ecosistema, calidad de agua superficial y subterránea, calidad de aire y suelo previo a la operación.' },
    { titulo: 'Identificación y valoración de impactos', desc: 'Matriz de Leopold aplicada a todas las etapas: construcción, operación, cierre y post-cierre.' },
    { titulo: 'Plan de Manejo Ambiental (PMA)', desc: 'Medidas específicas de prevención, mitigación, corrección y compensación para cada impacto identificado.' },
    { titulo: 'Plan de Monitoreo', desc: '12 puntos de muestreo hídrico, 4 estaciones de calidad de aire y monitoreo mensual de ruido en comunidades aledañas.' },
    { titulo: 'Plan de Cierre Progresivo', desc: 'Estrategia de rehabilitación de áreas disturbadas y restauración de cobertura vegetal al término de la vida útil.' },
    { titulo: 'Plan de Contingencias', desc: 'Protocolos de respuesta ante derrames, fallas en el sistema de relaves y eventos sísmicos.' },
  ];
}