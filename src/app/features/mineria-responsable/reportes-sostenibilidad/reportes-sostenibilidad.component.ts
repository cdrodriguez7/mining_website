import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reportes-sostenibilidad',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './reportes-sostenibilidad.component.html',
  styleUrls: ['./reportes-sostenibilidad.component.scss']
})
export class ReportesSostenibilidadComponent {}