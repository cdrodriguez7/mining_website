import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alerta-fraude',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alerta-fraude.component.html',
  styleUrls: ['./alerta-fraude.component.scss']
})
export class AlertaFraudeComponent {}