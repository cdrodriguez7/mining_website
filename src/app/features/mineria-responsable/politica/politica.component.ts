import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-politica',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.scss']
})
export class PoliticaComponent {}