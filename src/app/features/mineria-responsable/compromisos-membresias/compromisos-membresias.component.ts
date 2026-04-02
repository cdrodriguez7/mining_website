import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-compromisos-membresias',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './compromisos-membresias.component.html',
  styleUrls: ['./compromisos-membresias.component.scss']
})
export class CompromisosMembresiasComponent {
  membresias = [
    { nombre: 'Pacto Global ONU', tipo: 'Iniciativa voluntaria', descripcion: 'Adheridos a los 10 principios del Pacto Global en materia de derechos humanos, trabajo, medio ambiente y anticorrupción.' },
    { nombre: 'GRI Community', tipo: 'Marco de reporte', descripcion: 'Miembro de la comunidad GRI, comprometidos a reportar nuestro desempeño de sostenibilidad bajo GRI Standards 2021.' },
    { nombre: 'Cámara de Minería del Ecuador', tipo: 'Membresía sectorial', descripcion: 'Participamos activamente en los espacios de diálogo sectorial para el desarrollo de la minería responsable en Ecuador.' },
    { nombre: 'ESTMA (Canadá)', tipo: 'Cumplimiento normativo', descripcion: 'Publicamos anualmente los pagos realizados al gobierno ecuatoriano bajo la Extractive Sector Transparency Measures Act.' },
    { nombre: 'ODS / Agenda 2030', tipo: 'Compromiso voluntario', descripcion: 'Alineamos nuestra estrategia ESG con los Objetivos de Desarrollo Sostenible, con énfasis en ODS 8, 12, 13 y 17.' },
    { nombre: 'IRMA (en evaluación)', tipo: 'Certificación futura', descripcion: 'Iniciando el proceso de evaluación bajo el Initiative for Responsible Mining Assurance para certificación prevista en 2027.' },
  ];
}