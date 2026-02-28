import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reporte-tecnico',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './reporte-tecnico.component.html',
  styleUrls: ['./reporte-tecnico.component.scss']
})
export class ReporteTecnicoComponent {}