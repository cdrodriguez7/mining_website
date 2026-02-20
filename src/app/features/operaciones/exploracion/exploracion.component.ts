import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exploracion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exploracion.component.html',
  styleUrls: ['./exploracion.component.scss']
})
export class ExploracionComponent {}