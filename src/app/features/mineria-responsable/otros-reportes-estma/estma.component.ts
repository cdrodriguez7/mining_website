import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-estma',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './estma.component.html',
  styleUrls: ['./estma.component.scss']
})
export class EstmaComponent {}