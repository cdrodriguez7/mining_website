import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reservas-recursos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './reservas-recursos.component.html',
  styleUrls: ['./reservas-recursos.component.scss']
})
export class ReservasRecursosComponent {}