import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-materiales-junta',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './materiales-junta.component.html',
  styleUrls: ['./materiales-junta.component.scss']
})
export class MaterialesJuntaComponent {}
