import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="min-h-screen bg-dark-950 pt-32 pb-20">
      <div class="container-custom">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display font-bold text-white mb-6">
            Galería de <span class="gradient-text">Procesos Legales</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Documentación visual de todas las fases del proceso minero legal
          </p>
        </div>

        <!-- Phase Filter -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            *ngFor="let phase of phases"
            (click)="selectPhase(phase.slug)"
            [class.bg-accent-500]="selectedPhase === phase.slug"
            [class.bg-dark-800]="selectedPhase !== phase.slug"
            class="px-6 py-3 rounded-lg text-white hover:bg-accent-500 transition-colors">
            {{ phase.icon }} {{ phase.title }}
          </button>
        </div>

        <!-- Gallery Grid -->
        <div class="grid md:grid-cols-3 gap-6">
          <div *ngFor="let item of filteredGallery"
               class="bg-dark-800 rounded-xl overflow-hidden hover-lift cursor-pointer">
            <div class="aspect-video bg-gradient-to-br from-accent-500/20 to-primary-500/20 flex items-center justify-center">
              <span class="text-6xl">{{ item.icon }}</span>
            </div>
            <div class="p-6">
              <span class="text-xs bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full">
                {{ item.phase }}
              </span>
              <h3 class="text-xl font-display font-bold text-white mt-3 mb-2">
                {{ item.title }}
              </h3>
              <p class="text-gray-400 text-sm">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class GalleryComponent implements OnInit {
  selectedPhase: string = 'all';
  
  phases = [
    { slug: 'all', title: 'Todas', icon: '📸' },
    { slug: 'concesion-minera', title: 'Concesión', icon: '📄' },
    { slug: 'regularizacion-ambiental', title: 'Ambiental', icon: '🌍' },
    { slug: 'inicio-operaciones', title: 'Operaciones', icon: '⚙️' }
  ];

  galleryItems = [
    {
      phase: 'Concesión Minera',
      phaseSlug: 'concesion-minera',
      title: 'Formulario de Reserva',
      description: 'Sistema de Gestión Minera - Reserva de área',
      icon: '📋'
    },
    {
      phase: 'Concesión Minera',
      phaseSlug: 'concesion-minera',
      title: 'Título Minero',
      description: 'Resolución ministerial de otorgamiento',
      icon: '📄'
    },
    {
      phase: 'Regularización Ambiental',
      phaseSlug: 'regularizacion-ambiental',
      title: 'Estudio de Impacto Ambiental',
      description: 'EsIA aprobado por el Ministerio del Ambiente',
      icon: '🌍'
    },
    {
      phase: 'Regularización Ambiental',
      phaseSlug: 'regularizacion-ambiental',
      title: 'Licencia Ambiental',
      description: 'Autorización para operaciones mineras',
      icon: '✅'
    },
    {
      phase: 'Inicio de Operaciones',
      phaseSlug: 'inicio-operaciones',
      title: 'Infraestructura Minera',
      description: 'Instalaciones y equipamiento',
      icon: '⚙️'
    },
    {
      phase: 'Inicio de Operaciones',
      phaseSlug: 'inicio-operaciones',
      title: 'Equipos de Extracción',
      description: 'Maquinaria pesada operativa',
      icon: '🚜'
    }
  ];

  filteredGallery = this.galleryItems;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['phase']) {
        this.selectPhase(params['phase']);
      }
    });
  }

  selectPhase(slug: string) {
    this.selectedPhase = slug;
    if (slug === 'all') {
      this.filteredGallery = this.galleryItems;
    } else {
      this.filteredGallery = this.galleryItems.filter(item => item.phaseSlug === slug);
    }
  }
}