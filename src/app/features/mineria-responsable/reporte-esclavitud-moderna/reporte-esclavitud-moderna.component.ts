import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reporte-esclavitud-moderna',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './reporte-esclavitud-moderna.component.html',
  styleUrls: ['./reporte-esclavitud-moderna.component.scss']
})
export class ReporteEsclavitudModernaComponent {}