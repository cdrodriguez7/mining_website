import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-practicas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './practicas.component.html',
  styleUrls: ['./practicas.component.scss']
})
export class PracticasComponent {}
