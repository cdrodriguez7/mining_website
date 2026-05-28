import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

declare const L: any;

interface EmpresaAsociada {
  id: string;
  name: string;
  role: string;
  description: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
  website?: string;
  iconHtml?: string;
}

@Component({
  selector: 'app-empresas-asociadas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './empresas-asociadas.component.html',
  styleUrls: ['./empresas-asociadas.component.scss']
})
export class EmpresasAsociadasComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  
  map: any = null;
  selectedCompany: EmpresaAsociada | null = null;
  leafletLoaded = false;
  markersMap = new Map<string, any>();

  empresas: EmpresaAsociada[] = [
    {
      id: 'planpromin',
      name: 'PLANPROMIN S.A. (Oficinas Principales)',
      role: 'Administración & Exploración Geológica',
      description: 'Nuestra sede principal encargada de la planificación de recursos, administración corporativa, geología avanzada y licenciamiento minero.',
      address: 'Ciudad Daule, Cantón Daule, Provincia del Guayas, Ecuador',
      contact: 'info@planpromin.com | +593 4-279-XXXX',
      lat: -1.8622,
      lng: -79.9789,
      iconHtml: '<div class="custom-marker marker-planpromin">P</div>'
    },
    {
      id: 'ponce-enriquez',
      name: 'Planta de Beneficio & Relaveras',
      role: 'Operaciones Metalúrgicas y Reprocesamiento',
      description: 'Centro de operaciones físicas. Cuenta con la planta de molienda y beneficio de 1280 Ton/día y las 6 relaveras geotécnicamente controladas.',
      address: 'Cantón Camilo Ponce Enríquez, Provincia del Azuay, Ecuador',
      contact: 'operaciones@planpromin.com | +593 7-243-XXXX',
      lat: -3.0763,
      lng: -79.7423,
      iconHtml: '<div class="custom-marker marker-operations">O</div>'
    },
    {
      id: 'machala-logistica',
      name: 'Transporte Aurífero Machala S.A.',
      role: 'Logística Segura & Cadena de Custodia',
      description: 'Empresa asociada líder encargada de la movilización de relaves históricos dispersos y del transporte de alta seguridad del mineral final.',
      address: 'Av. 25 de Junio Km 1.5, Machala, Provincia de El Oro, Ecuador',
      contact: 'logistica.machala@planpromin.com',
      lat: -3.2581,
      lng: -79.9553,
      iconHtml: '<div class="custom-marker marker-partner">L</div>'
    },
    {
      id: 'ecogreen',
      name: 'Consultoría Ambiental EcoGreen',
      role: 'Gestión Sostenible & Auditoría Ambiental',
      description: 'Socio estratégico encargado de los planes de manejo ambiental, monitoreo hídrico continuo y la revegetación de relaveras cerradas.',
      address: 'Urdesa Central, Guayaquil, Provincia del Guayas, Ecuador',
      contact: 'ecogreen@consultora.com',
      lat: -2.1894,
      lng: -79.8890,
      iconHtml: '<div class="custom-marker marker-partner">E</div>'
    },
    {
      id: 'geomin',
      name: 'Ingeniería Geomin Consultores',
      role: 'Diseño Estructural 3D & Geotecnia',
      description: 'Consultora asociada que provee la modelación tridimensional avanzada de túneles y el diseño de la estabilidad física de nuestras presas.',
      address: 'Av. de los Shyris, Quito, Provincia de Pichincha, Ecuador',
      contact: 'ingenieria@geomin.com.ec',
      lat: -0.1807,
      lng: -78.4678,
      iconHtml: '<div class="custom-marker marker-partner">G</div>'
    }
  ];

  ngOnInit(): void {
    this.selectedCompany = this.empresas[0];
    this.loadLeaflet();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadLeaflet(): void {
    // Si ya existe el script en el DOM, inicializar directamente
    if (document.getElementById('leaflet-css') && (window as any).L) {
      this.leafletLoaded = true;
      setTimeout(() => this.initMap(), 100);
      return;
    }

    // Cargar CSS
    const css = document.createElement('link');
    css.id = 'leaflet-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    // Cargar JS
    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => {
      this.leafletLoaded = true;
      this.cdr.detectChanges();
      setTimeout(() => this.initMap(), 100);
    };
    document.head.appendChild(js);
  }

  private initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.warn('[Map] Contenedor de mapa no disponible');
      return;
    }

    // Inicializar mapa centrado en Ecuador central
    this.map = L.map('map', {
      center: [-1.8, -79.0],
      zoom: 7,
      zoomControl: true
    });

    // Mosaicos en modo oscuro CartoDB Dark Matter (sintonía premium dark mode)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    // Agregar marcadores para cada empresa
    this.empresas.forEach(emp => {
      const customIcon = L.divIcon({
        html: emp.iconHtml,
        className: 'leaflet-custom-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([emp.lat, emp.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="map-popup-card">
            <h4 class="popup-title">${emp.name}</h4>
            <p class="popup-role">${emp.role}</p>
            <p class="popup-address">${emp.address}</p>
          </div>
        `);

      // Guardar referencia del marcador
      this.markersMap.set(emp.id, marker);

      // Al hacer clic en el marcador, seleccionarlo en la lista
      marker.on('click', () => {
        this.selectCompany(emp, false);
      });
    });

    // Centrar en la empresa por defecto al iniciar
    if (this.selectedCompany) {
      this.selectCompany(this.selectedCompany, true);
    }
  }

  selectCompany(company: EmpresaAsociada, flyTo = true): void {
    this.selectedCompany = company;
    this.cdr.detectChanges();

    if (this.map && flyTo) {
      // Volar hacia la ubicación de la empresa con zoom de detalle (12)
      this.map.flyTo([company.lat, company.lng], 12, {
        duration: 1.5
      });

      // Abrir el popup correspondiente
      const marker = this.markersMap.get(company.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 1500);
      }
    }
  }
}
