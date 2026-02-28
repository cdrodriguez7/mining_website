import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-operativo',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './operativo.component.html',
  styleUrls: ['./operativo.component.scss']
})
export class OperativoComponent {}