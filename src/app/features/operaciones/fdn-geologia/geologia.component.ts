import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-geologia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './geologia.component.html',
  styleUrls: ['./geologia.component.scss']
})
export class GeologiaComponent {}