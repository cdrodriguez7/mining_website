import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-impacto-ambiental',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './impacto-ambiental.component.html',
  styleUrls: ['./impacto-ambiental.component.scss']
})
export class ImpactoAmbientalComponent {}