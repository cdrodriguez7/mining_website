import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-precio-accion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './precio-accion.component.html',
  styleUrls: ['./precio-accion.component.scss']
})
export class PrecioAccionComponent {
  stockData = {
    tsx: {
      symbol: 'TME',
      price: 12.45,
      change: +0.35,
      changePercent: +2.89,
      volume: '1.2M',
      marketCap: '850M USD'
    }
  };
}
