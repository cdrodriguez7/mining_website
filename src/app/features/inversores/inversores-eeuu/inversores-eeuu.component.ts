import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-inversores-eeuu',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './inversores-eeuu.component.html',
  styleUrls: ['./inversores-eeuu.component.scss']
})
export class InversoresEeuuComponent {}
