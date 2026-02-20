import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-presentaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './presentaciones.component.html',
  styleUrls: ['./presentaciones.component.scss']
})
export class PresentacionesComponent {}
