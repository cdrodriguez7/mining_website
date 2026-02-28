import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-proyecciones',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './proyecciones.component.html',
  styleUrls: ['./proyecciones.component.scss']
})
export class ProyeccionesComponent {}