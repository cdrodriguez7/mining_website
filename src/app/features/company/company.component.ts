import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="min-h-screen bg-dark-950 pt-32 pb-20">
      <div class="container-custom">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display font-bold text-white mb-6">
            Nuestra <span class="gradient-text">Compañía</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprometidos con la transparencia y el desarrollo sostenible de la minería en Ponce Enríquez
          </p>
        </div>

        <!-- About Section -->
        <div class="bg-dark-800 rounded-2xl p-8 md:p-12 mb-12">
          <h2 class="text-3xl font-display font-bold text-white mb-6">Quiénes Somos</h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-6">
            Somos una plataforma dedicada a promover la transparencia en el sector minero del cantón Ponce Enríquez, 
            Azuay, Ecuador. Nuestra misión es documentar y mostrar públicamente todos los procesos legales y operativos 
            que las empresas mineras deben cumplir para operar de manera responsable y legal.
          </p>
          <p class="text-gray-300 text-lg leading-relaxed">
            Con más de 82 concesiones activas y siendo el cantón Ponce Enríquez junto a la provincia de El Oro responsables del 86% de la producción nacional de oro de la pequeña minería, 
            creemos que la transparencia es fundamental para generar confianza entre la industria, las autoridades 
            y la ciudadanía.
          </p>
        </div>

        <!-- Mission & Vision -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="bg-dark-800 rounded-2xl p-8">
            <div class="text-5xl mb-4">🎯</div>
            <h3 class="text-2xl font-display font-bold text-white mb-4">Nuestra Misión</h3>
            <p class="text-gray-300">
              Promover la transparencia en la minería mediante la documentación clara y accesible de todos 
              los procesos legales, operativos y ambientales, generando confianza y fomentando la minería responsable.
            </p>
          </div>
          <div class="bg-dark-800 rounded-2xl p-8">
            <div class="text-5xl mb-4">👁️</div>
            <h3 class="text-2xl font-display font-bold text-white mb-4">Nuestra Visión</h3>
            <p class="text-gray-300">
              Ser la plataforma de referencia en transparencia minera en Ecuador, sirviendo como modelo para 
              otros cantones y contribuyendo al desarrollo sostenible de la industria extractiva.
            </p>
          </div>
        </div>

        <!-- Values -->
        <div class="bg-dark-800 rounded-2xl p-8 md:p-12">
          <h2 class="text-3xl font-display font-bold text-white mb-8 text-center">Nuestros Valores</h2>
          <div class="grid md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-4xl mb-3">🔍</div>
              <h4 class="text-lg font-semibold text-white mb-2">Transparencia</h4>
              <p class="text-sm text-gray-400">Información clara y accesible para todos</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">🌱</div>
              <h4 class="text-lg font-semibold text-white mb-2">Sostenibilidad</h4>
              <p class="text-sm text-gray-400">Compromiso con el medio ambiente</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">⚖️</div>
              <h4 class="text-lg font-semibold text-white mb-2">Legalidad</h4>
              <p class="text-sm text-gray-400">Cumplimiento de todas las normativas</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">🤝</div>
              <h4 class="text-lg font-semibold text-white mb-2">Comunidad</h4>
              <p class="text-sm text-gray-400">Desarrollo local y empleo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CompanyComponent {}