import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-presentaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './presentaciones.component.html',
  styleUrls: ['./presentaciones.component.scss']
})
export class PresentacionesComponent {}
