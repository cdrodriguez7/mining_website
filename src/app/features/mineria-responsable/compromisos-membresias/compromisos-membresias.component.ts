import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-compromisos-membresias',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './compromisos-membresias.component.html',
  styleUrls: ['./compromisos-membresias.component.scss']
})
export class CompromisosMembresiasComponent {}