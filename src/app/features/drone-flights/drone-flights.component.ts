import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drone-flights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="min-h-screen bg-dark-950 pt-32 pb-20">
      <div class="container-custom">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display font-bold text-white mb-6">
            Sobrevuelo con <span class="gradient-text">Drones</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Tecnología aérea avanzada para mapeo, inspección y monitoreo de operaciones mineras
          </p>
        </div>

        <!-- Main Content -->
        <div class="bg-dark-800 rounded-2xl p-8 md:p-12 mb-12">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-display font-bold text-white mb-6">
                Mapeo Aéreo de Precisión
              </h2>
              <p class="text-gray-300 mb-6">
                Utilizamos drones de última generación equipados con cámaras de alta resolución y 
                sensores especializados para capturar imágenes aéreas detalladas de las áreas mineras.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <div class="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-white font-semibold mb-1">Levantamiento Topográfico</h4>
                    <p class="text-gray-400 text-sm">Mapas detallados con precisión centimétrica</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <div class="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-white font-semibold mb-1">Modelos 3D</h4>
                    <p class="text-gray-400 text-sm">Reconstrucción tridimensional del terreno</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <div class="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-white font-semibold mb-1">Inspección Visual</h4>
                    <p class="text-gray-400 text-sm">Acceso a áreas difíciles o peligrosas</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-xl min-h-[400px] flex items-center justify-center">
              <div class="text-center">
                <div class="text-8xl mb-4">🚁</div>
                <p class="text-white text-xl">Tecnología Aérea Avanzada</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications -->
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-dark-800 rounded-xl p-6">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-display font-bold text-white mb-3">
              Monitoreo de Progreso
            </h3>
            <p class="text-gray-400">
              Seguimiento temporal de avance de excavaciones y construcciones
            </p>
          </div>
          <div class="bg-dark-800 rounded-xl p-6">
            <div class="text-4xl mb-4">🌍</div>
            <h3 class="text-xl font-display font-bold text-white mb-3">
              Control Ambiental
            </h3>
            <p class="text-gray-400">
              Vigilancia de reforestación, cuerpos de agua y áreas protegidas
            </p>
          </div>
          <div class="bg-dark-800 rounded-xl p-6">
            <div class="text-4xl mb-4">🛡️</div>
            <h3 class="text-xl font-display font-bold text-white mb-3">
              Seguridad
            </h3>
            <p class="text-gray-400">
              Inspección de taludes, estructuras y áreas de riesgo
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class DroneFlightsComponent {}