import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-estrategia-5-anos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './estrategia-5-anos.component.html',
  styleUrls: ['./estrategia-5-anos.component.scss']
})
export class Estrategia5AnosComponent {
  pilares = [
    { meta: 'TRIR ≤ 0.8', area: 'Seguridad', plazo: 'Meta 2030' },
    { meta: '−20%', area: 'Emisiones GHG', plazo: 'vs. base 2022' },
    { meta: '700 ha', area: 'Reforestación', plazo: 'Acumulada al 2030' },
    { meta: '25%', area: 'Mujeres en nómina', plazo: 'Meta 2030' },
  ];

  ejes = [
    {
      categoria: 'Seguridad',
      titulo: 'Cero daño, cero tolerancia',
      descripcion: 'Alcanzar TRIR ≤ 0.8 mediante la implantación completa de ISO 45001, digitalización de reportes de seguridad y fortalecimiento de la cultura preventiva en todos los niveles.',
      kpis: ['TRIR ≤ 0.8 al 2030', 'ISO 45001 certificado 2026', '100% ART completadas']
    },
    {
      categoria: 'Medio Ambiente',
      titulo: 'Operación con huella mínima',
      descripcion: 'Reducir la huella ambiental de la operación a través de la gestión eficiente del agua, eliminación de vertidos no conformes y ampliación del programa de reforestación a 700 ha acumuladas.',
      kpis: ['700 ha reforestadas al 2030', '0 vertidos no conformes', 'ISO 14001 recertificado']
    },
    {
      categoria: 'Clima',
      titulo: 'Descarbonización progresiva',
      descripcion: 'Reducción de emisiones Alcance 1+2 en un 20% absoluto respecto a 2022, incorporando energía solar fotovoltaica y mejorando la eficiencia de la flota y maquinaria.',
      kpis: ['−20% GHG absoluto al 2030', '400 kWp solar fotovoltaico', 'Verificación GHG anual']
    },
    {
      categoria: 'Comunidades',
      titulo: 'Desarrollo local compartido',
      descripcion: 'Aumentar la inversión social a $600K anuales al 2030, elevar la participación femenina en la nómina al 25% y mantener el 75%+ de empleo local.',
      kpis: ['$600K inversión social/año', '25% mujeres en nómina', '75%+ empleo local']
    },
    {
      categoria: 'Gobernanza',
      titulo: 'Transparencia y rendición de cuentas',
      descripcion: 'Publicar reportes anuales verificados bajo GRI, avanzar en la evaluación IRMA y mantener el 100% de cumplimiento de pagos al gobierno bajo el estándar ESTMA.',
      kpis: ['Reporte GRI verificado anual', 'Evaluación IRMA iniciada 2027', 'ESTMA publicado anual']
    },
  ];
}