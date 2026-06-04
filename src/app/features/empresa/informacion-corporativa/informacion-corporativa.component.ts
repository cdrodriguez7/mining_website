import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-informacion-corporativa',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './informacion-corporativa.component.html',
  styleUrls: ['./informacion-corporativa.component.scss']
})
export class InformacionCorporativaComponent {
  datosLegales = [
    { etiqueta: 'Razón Social', valor: 'PLANPROMIN S.A.' },
    { etiqueta: 'RUC', valor: '0791754690001' },
    { etiqueta: 'Tipo de Sociedad', valor: 'Sociedad Anónima' },
    { etiqueta: 'Fecha de Constitución', valor: '23 de mayo de 2011' },
    { etiqueta: 'Domicilio Principal', valor: 'Ciudad Daule, Cantón Daule, Provincia del Guayas, Ecuador' },
    { etiqueta: 'Objeto Social', valor: 'Exploración, explotación, beneficio y comercialización de minerales metálicos y no metálicos' },
    { etiqueta: 'Capital Suscrito', valor: 'USD 400.000,00' },
    { etiqueta: 'Registro Mercantil', valor: 'Notario Sexto del Cantón Machala, Tomo 1203, Número 643' },
    { etiqueta: 'Supervisión', valor: 'Agencia de Regulación y Control Minero (ARCOM) — Expediente MIN-CPE-2003-0041' },
    { etiqueta: 'Régimen Tributario', valor: 'Contribuyente Especial — Servicio de Rentas Internas (SRI)' },
  ];

  concesiones = [
    { nombre: 'Área Ponce Norte', tipo: 'Explotación', has: '240 ha', estado: 'Vigente', vence: '2034' },
    { nombre: 'Área Ponce Sur', tipo: 'Explotación', has: '185 ha', estado: 'Vigente', vence: '2033' },
    { nombre: 'Bloque Río Gala', tipo: 'Exploración', has: '320 ha', estado: 'Vigente', vence: '2027' },
    { nombre: 'Sector La Fortuna', tipo: 'Explotación', has: '145 ha', estado: 'Vigente', vence: '2031' },
    { nombre: 'Bloque Cerro Pelado', tipo: 'Exploración Avanzada', has: '410 ha', estado: 'Vigente', vence: '2028' },
  ];

}
