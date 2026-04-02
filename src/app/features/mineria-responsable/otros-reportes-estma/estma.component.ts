import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-estma',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './estma.component.html',
  styleUrls: ['./estma.component.scss']
})
export class EstmaComponent {
  pagos = [
    { categoria: 'Regalías mineras', entidad: 'Ministerio de Minería (ARCOM)', monto: '$1.240.000' },
    { categoria: 'Impuesto a la renta', entidad: 'Servicio de Rentas Internas (SRI)', monto: '$890.000' },
    { categoria: 'Aporte IESS patronal', entidad: 'Instituto Ecuatoriano de Seguridad Social', monto: '$310.000' },
    { categoria: 'Contribución especial minera', entidad: 'Gobierno Autónomo Descentralizado Azuay', monto: '$180.000' },
    { categoria: 'Tasas y permisos ambientales', entidad: 'Ministerio del Ambiente (MAATE)', monto: '$95.000' },
  ];
}