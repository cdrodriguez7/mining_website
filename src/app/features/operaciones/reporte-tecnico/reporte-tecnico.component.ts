import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reporte-tecnico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reporte-tecnico.component.html',
  styleUrls: ['./reporte-tecnico.component.scss']
})
export class ReporteTecnicoComponent {}