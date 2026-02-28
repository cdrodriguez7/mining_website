import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-salud-seguridad',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './salud-seguridad.component.html',
  styleUrls: ['./salud-seguridad.component.scss']
})
export class SaludSeguridadComponent {}
