import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-noticias-ano',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticias-ano.component.html',
  styleUrls: ['./noticias-ano.component.scss']
})
export class NoticiasAnoComponent {}