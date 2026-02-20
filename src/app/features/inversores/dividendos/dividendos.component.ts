import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dividendos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dividendos.component.html',
  styleUrls: ['./dividendos.component.scss']
})
export class DividendosComponent {}
