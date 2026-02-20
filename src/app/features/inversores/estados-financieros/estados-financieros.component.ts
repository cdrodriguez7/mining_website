import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estados-financieros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estados-financieros.component.html',
  styleUrls: ['./estados-financieros.component.scss']
})
export class EstadosFinancierosComponent {}
