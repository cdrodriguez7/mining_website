import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comunidades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.scss']
})
export class ComunidadesComponent {}