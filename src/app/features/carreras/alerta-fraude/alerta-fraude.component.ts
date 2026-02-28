import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-alerta-fraude',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './alerta-fraude.component.html',
  styleUrls: ['./alerta-fraude.component.scss']
})
export class AlertaFraudeComponent {}