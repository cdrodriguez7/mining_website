import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-arqueologia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './arqueologia.component.html',
  styleUrls: ['./arqueologia.component.scss']
})
export class ArqueologiaComponent {}