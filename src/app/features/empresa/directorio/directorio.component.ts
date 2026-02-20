import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.scss']
})
export class DirectorioComponent {}
