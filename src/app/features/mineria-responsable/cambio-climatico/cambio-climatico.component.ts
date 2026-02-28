import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cambio-climatico',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent ],
  templateUrl: './cambio-climatico.component.html',
  styleUrls: ['./cambio-climatico.component.scss']
})
export class CambioClimaticoComponent {}