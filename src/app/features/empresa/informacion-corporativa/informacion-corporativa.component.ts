import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-informacion-corporativa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './informacion-corporativa.component.html',
  styleUrls: ['./informacion-corporativa.component.scss']
})
export class InformacionCorporativaComponent {}
