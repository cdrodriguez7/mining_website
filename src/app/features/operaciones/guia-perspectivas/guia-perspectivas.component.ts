import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-guia-perspectivas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './guia-perspectivas.component.html',
  styleUrls: ['./guia-perspectivas.component.scss']
})
export class GuiaPerspectivasComponent {}