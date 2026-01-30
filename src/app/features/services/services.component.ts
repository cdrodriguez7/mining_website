import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="min-h-screen bg-dark-950 pt-32 pb-20">
      <div class="container-custom">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display font-bold text-white mb-6">
            Nuestros <span class="gradient-text">Servicios</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Servicios integrales de minería responsable con los más altos estándares de calidad
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid md:grid-cols-2 gap-8">
          <div *ngFor="let service of services" 
               class="bg-dark-800 rounded-2xl p-8 hover-lift">
            <div class="text-5xl mb-6">{{ service.icon }}</div>
            <h3 class="text-2xl font-display font-bold text-white mb-4">
              {{ service.title }}
            </h3>
            <p class="text-gray-300 mb-6">{{ service.description }}</p>
            <ul class="space-y-3">
              <li *ngFor="let feature of service.features" 
                  class="flex items-start">
                <svg class="w-6 h-6 text-accent-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-16 text-center">
          <a routerLink="/contacto" class="btn-primary inline-flex items-center space-x-2">
            <span>Solicita Información</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  services = [
    {
      title: 'Exploración y Prospección',
      description: 'Estudios geológicos detallados y evaluación de yacimientos minerales',
      icon: '🔍',
      features: [
        'Mapeo geológico de superficie',
        'Análisis geoquímico de suelos',
        'Perforación exploratoria',
        'Evaluación de reservas minerales',
        'Estudios de viabilidad económica'
      ]
    },
    {
      title: 'Explotación Minera',
      description: 'Extracción segura y eficiente de minerales con tecnología de punta',
      icon: '⛏️',
      features: [
        'Minería subterránea con galerías',
        'Minería a cielo abierto',
        'Transporte y acarreo de material',
        'Control de calidad del mineral',
        'Seguridad industrial'
      ]
    },
    {
      title: 'Procesamiento Metalúrgico',
      description: 'Beneficio y concentración de minerales extraídos',
      icon: '⚗️',
      features: [
        'Trituración y molienda',
        'Concentración por flotación',
        'Separación gravimétrica',
        'Lixiviación y precipitación',
        'Refinación de metales preciosos'
      ]
    },
    {
      title: 'Gestión Ambiental',
      description: 'Monitoreo y cumplimiento estricto de normativas ambientales',
      icon: '🌱',
      features: [
        'Tratamiento de aguas residuales',
        'Gestión de relaves y desechos',
        'Programas de reforestación',
        'Auditorías ambientales periódicas',
        'Planes de cierre y rehabilitación'
      ]
    },
    {
      title: 'Sobrevuelo con Drones',
      description: 'Tecnología aérea para mapeo y monitoreo de operaciones',
      icon: '🚁',
      features: [
        'Levantamiento topográfico aéreo',
        'Inspección de áreas remotas',
        'Monitoreo ambiental',
        'Documentación fotográfica',
        'Modelos 3D del terreno'
      ]
    },
    {
      title: 'Consultoría Legal',
      description: 'Asesoría en procesos de legalización y cumplimiento normativo',
      icon: '⚖️',
      features: [
        'Tramitación de concesiones',
        'Licencias ambientales',
        'Cumplimiento regulatorio',
        'Informes de producción',
        'Auditorías de cumplimiento'
      ]
    }
  ];
}