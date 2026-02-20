import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operativo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operativo.component.html',
  styleUrls: ['./operativo.component.scss']
})
export class OperativoComponent {}