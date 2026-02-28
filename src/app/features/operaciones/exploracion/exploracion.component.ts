import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-exploracion',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './exploracion.component.html',
  styleUrls: ['./exploracion.component.scss']
})
export class ExploracionComponent {}