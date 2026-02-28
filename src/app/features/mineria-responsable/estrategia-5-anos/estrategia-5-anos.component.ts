import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-estrategia-5-anos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './estrategia-5-anos.component.html',
  styleUrls: ['./estrategia-5-anos.component.scss']
})
export class Estrategia5AnosComponent {}