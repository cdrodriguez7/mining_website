import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-geologia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './geologia.component.html',
  styleUrls: ['./geologia.component.scss']
})
export class GeologiaComponent {}