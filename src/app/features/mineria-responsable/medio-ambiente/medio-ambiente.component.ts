import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-medio-ambiente',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './medio-ambiente.component.html',
  styleUrls: ['./medio-ambiente.component.scss']
})
export class MedioAmbienteComponent {}