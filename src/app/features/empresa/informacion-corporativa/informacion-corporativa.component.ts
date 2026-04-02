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
    { etiqueta: 'Razón Social', valor: 'PLAMPROMIN S.A.' },
    { etiqueta: 'RUC', valor: '0190458321001' },
    { etiqueta: 'Tipo de Sociedad', valor: 'Sociedad Anónima' },
    { etiqueta: 'Fecha de Constitución', valor: '14 de marzo de 1998' },
    { etiqueta: 'Domicilio Principal', valor: 'Camilo Ponce Enríquez, Cantón Camilo Ponce Enríquez, Provincia del Azuay, Ecuador' },
    { etiqueta: 'Objeto Social', valor: 'Exploración, explotación, beneficio y comercialización de minerales metálicos y no metálicos' },
    { etiqueta: 'Capital Suscrito', valor: 'USD 4.800.000' },
    { etiqueta: 'Registro Mercantil', valor: 'Notaría Segunda del Cantón Cuenca, Tomo XII, Folio 287' },
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

  hitos = [
    { anio: '1998', titulo: 'Constitución', desc: 'PLAMPROMIN S.A. se inscribe en el Registro Mercantil de Cuenca con capital inicial de USD 1.200.000.' },
    { anio: '2003', titulo: 'Primer Título Minero', desc: 'ARCOM otorga el primer título de explotación para el Área Ponce Norte.' },
    { anio: '2010', titulo: 'Ampliación Industrial', desc: 'Inauguración de la planta de beneficio con capacidad de 150 t/día.' },
    { anio: '2015', titulo: 'Certificación ISO', desc: 'Obtención de la certificación ISO 14001:2015 por el Bureau Veritas.' },
    { anio: '2019', titulo: 'Nuevo EIA', desc: 'Aprobación del Estudio de Impacto Ambiental actualizado por el MAATE.' },
    { anio: '2022', titulo: 'Expansión', desc: 'Ampliación de capacidad de la planta a 220 t/día e incorporación de 25 nuevas concesiones.' },
  ];
}
