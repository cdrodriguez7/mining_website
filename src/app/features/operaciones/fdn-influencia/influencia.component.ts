import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

declare const L: any;

interface Concesion {
  id: string;
  name: string;
  distance: string;
  distanceNum: number;
  mineralType: string;
  grade: string;
  weeklyTonnage: number;
  status: string;
  statusClass: string;
  description: string;
  lat: number;
  lng: number;
  transitTime: string;
  routeStatus: string;
  iconHtml?: string;
}

interface RelaveraMarker {
  id: string;
  name: string;
  capacity: string;
  occupancy: number;
  status: string;
  lat: number;
  lng: number;
  iconHtml?: string;
}

@Component({
  selector: 'app-fdn-influencia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './influencia.component.html',
  styleUrls: ['./influencia.component.scss']
})
export class InfluenciaComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  
  map: any = null;
  selectedConcesion: Concesion | null = null;
  leafletLoaded = false;
  markersMap = new Map<string, any>();
  circles: any[] = [];
  polylines: any[] = [];

  // Planta central
  plantaCentral = {
    lat: -3.0763,
    lng: -79.7423,
    name: 'Complejo Metalúrgico Shumiral (PLANPROMIN S.A.)',
    description: 'Central de procesamiento y beneficio. Recibe, analiza y procesa mineral proveniente de las concesiones asociadas del cantón.'
  };

  concesiones: Concesion[] = [
    {
      id: 'muyuyacu',
      name: 'Concesión Muyuyacu',
      distance: '8.2 km',
      distanceNum: 8.2,
      mineralType: 'Oro libre (cuarzo) + Sulfuros auríferos',
      grade: '12.5 g/t Au',
      weeklyTonnage: 320,
      status: 'Envío Activo',
      statusClass: 'bg-green-500',
      description: 'Concesión activa ubicada en la parte alta de la cordillera. Envía mineral bruto compuesto por filones de cuarzo con abundante pirita y oro libre grueso.',
      lat: -3.0300,
      lng: -79.7000,
      transitTime: '25 minutos',
      routeStatus: 'Normal (Pavimentada / Lastrada)',
      iconHtml: '<div class="custom-marker marker-concesion">M1</div>'
    },
    {
      id: 'la-lopez',
      name: 'Mina La López',
      distance: '3.9 km',
      distanceNum: 3.9,
      mineralType: 'Polimetálico Au-Cu (Calcopirita)',
      grade: '8.8 g/t Au, 1.2% Cu',
      weeklyTonnage: 180,
      status: 'Envío Activo',
      statusClass: 'bg-green-500',
      description: 'Ubicada en el sector La López. Mineralización polimetálica. Los sulfuros de cobre son recuperados prioritariamente en el circuito de flotación bulk de PLANPROMIN.',
      lat: -3.1100,
      lng: -79.7500,
      transitTime: '15 minutos',
      routeStatus: 'Normal (Lastrada)',
      iconHtml: '<div class="custom-marker marker-concesion">M2</div>'
    },
    {
      id: 'bella-rica',
      name: 'Sector Bella Rica',
      distance: '11.3 km',
      distanceNum: 11.3,
      mineralType: 'Vetas de cuarzo-pirita-arsenopirita',
      grade: '15.2 g/t Au',
      weeklyTonnage: 450,
      status: 'Envío Programado',
      statusClass: 'bg-yellow-500',
      description: 'Una de las zonas mineras más tradicionales de Ponce Enríquez. Envía lotes semanales homogéneos de alta ley para molienda fina y lixiviación CIL.',
      lat: -3.0800,
      lng: -79.6400,
      transitTime: '35 minutos',
      routeStatus: 'Tránsito Precavido (Vía de montaña)',
      iconHtml: '<div class="custom-marker marker-concesion">M3</div>'
    },
    {
      id: 'san-gerardo',
      name: 'Concesión San Gerardo',
      distance: '16.0 km',
      distanceNum: 16.0,
      mineralType: 'Relaves y arenas finas auríferas',
      grade: '3.5 g/t Au',
      weeklyTonnage: 600,
      status: 'Envío Activo',
      statusClass: 'bg-green-500',
      description: 'Despacha arenas de moliendas históricas de terceros para reprocesamiento metalúrgico avanzado en el módulo de concentración de colas de PLANPROMIN.',
      lat: -3.1800,
      lng: -79.6400,
      transitTime: '45 minutos',
      routeStatus: 'Normal (E35 Troncal + Vía secundaria)',
      iconHtml: '<div class="custom-marker marker-concesion">M4</div>'
    },
    {
      id: 'tenguel-alta',
      name: 'Mina Tenguel Alta',
      distance: '18.2 km',
      distanceNum: 18.2,
      mineralType: 'Óxidos superficiales de oro',
      grade: '5.1 g/t Au',
      weeklyTonnage: 120,
      status: 'Bajo Monitoreo',
      statusClass: 'bg-blue-500',
      description: 'Ubicada en el límite provincial de Guayas y Azuay. Proporciona mineral oxidado de fácil lixiviación. Envíos intermitentes de acuerdo a campañas de exploración.',
      lat: -2.9900,
      lng: -79.8800,
      transitTime: '50 minutos',
      routeStatus: 'Restringido (Control vial temporal)',
      iconHtml: '<div class="custom-marker marker-concesion">M5</div>'
    }
  ];

  relaveras: RelaveraMarker[] = [
    {
      id: 'fdn-1',
      name: 'Relavera FDN-1 (Principal)',
      capacity: '320,000 m³',
      occupancy: 78,
      status: 'Reprocesamiento Activo',
      lat: -3.0780,
      lng: -79.7400,
      iconHtml: '<div class="custom-marker marker-relavera">R1</div>'
    },
    {
      id: 'ponce-sur',
      name: 'Relavera Ponce Sur',
      capacity: '180,000 m³',
      occupancy: 62,
      status: 'Reprocesamiento Activo',
      lat: -3.0850,
      lng: -79.7450,
      iconHtml: '<div class="custom-marker marker-relavera">R2</div>'
    },
    {
      id: 'el-salto',
      name: 'Relavera El Salto',
      capacity: '240,000 m³',
      occupancy: 95,
      status: 'Monitoreo e Inyección',
      lat: -3.0710,
      lng: -79.7350,
      iconHtml: '<div class="custom-marker marker-relavera">R3</div>'
    },
    {
      id: 'mirador',
      name: 'Relavera Mirador',
      capacity: '150,000 m³',
      occupancy: 100,
      status: 'Clausurado & Reforestado',
      lat: -3.0650,
      lng: -79.7300,
      iconHtml: '<div class="custom-marker marker-relavera">R4</div>'
    },
    {
      id: 'ponce-norte',
      name: 'Relavera Ponce Norte',
      capacity: '200,000 m³',
      occupancy: 15,
      status: 'En Preparación',
      lat: -3.0600,
      lng: -79.7500,
      iconHtml: '<div class="custom-marker marker-relavera">R5</div>'
    },
    {
      id: 'rio-chico',
      name: 'Relavera Río Chico',
      capacity: '110,000 m³',
      occupancy: 88,
      status: 'Mitigación Ambiental Activa',
      lat: -3.0730,
      lng: -79.7480,
      iconHtml: '<div class="custom-marker marker-relavera">R6</div>'
    }
  ];

  // Etapas del Toll Milling
  tollMillingSteps = [
    {
      step: '01',
      title: 'Recepción y Pesaje',
      desc: 'El mineral llega en volquetas certificadas, pasa por báscula computarizada y se verifica el código de catastro de la concesión proveedora.'
    },
    {
      step: '02',
      title: 'Muestreo Técnico',
      desc: 'Se realiza un muestreo de porción representativa mediante cortadores automáticos para asegurar la imparcialidad del análisis.'
    },
    {
      step: '03',
      title: 'Ensayos y Leyes',
      desc: 'Nuestro laboratorio metalúrgico en sitio analiza el mineral por ensayo al fuego (fire assay) para certificar las leyes de oro de cabeza.'
    },
    {
      step: '04',
      title: 'Beneficio Customizado',
      desc: 'El lote se procesa por el circuito metalúrgico idóneo (Molienda + Gravimetría + Flotación/CIL) según su caracterización mineralógica.'
    },
    {
      step: '05',
      title: 'Liquidación y Retorno',
      desc: 'Se entrega una liquidación exacta basada en la recuperación metalúrgica certificada y se dispone ecológicamente de los relaves.'
    }
  ];

  ngOnInit(): void {
    // Seleccionar por defecto la primera concesión
    this.selectedConcesion = this.concesiones[0];
    this.loadLeaflet();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadLeaflet(): void {
    if (document.getElementById('leaflet-css') && (window as any).L) {
      this.leafletLoaded = true;
      setTimeout(() => this.initMap(), 100);
      return;
    }

    // Cargar CSS de Leaflet
    const css = document.createElement('link');
    css.id = 'leaflet-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    // Cargar JS de Leaflet
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
      console.warn('[Map] Contenedor de mapa para área de influencia no disponible');
      return;
    }

    // Definición de Mapas Base (Mosaicos)
    const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: 'Map data &copy;2026 Google',
      maxZoom: 20
    });

    const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
      maxZoom: 17
    });

    // Centrado en el Complejo Metalúrgico Shumiral (Ponce Enríquez)
    // Se establece Google Satellite como la capa por defecto para impresionar con la vista real de la naturaleza
    this.map = L.map('map', {
      center: [this.plantaCentral.lat, this.plantaCentral.lng],
      zoom: 11,
      zoomControl: true,
      layers: [googleSatellite]
    });

    // Agregar selector de capas (Control de Capas) en la esquina superior derecha
    const baseMaps = {
      'Vista Satelital (Google)': googleSatellite,
      'Relieve Topográfico (Esri)': esriTopo
    };
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(this.map);

    // Agregar círculos de radio de influencia concéntricos con colores de la naturaleza (verdes/emerald)
    // 5 km (Verde Esmeralda)
    const c5 = L.circle([this.plantaCentral.lat, this.plantaCentral.lng], {
      radius: 5000,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.06,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(this.map).bindTooltip('Radio de 5 km: Abastecimiento Inmediato', { sticky: true });
    this.circles.push(c5);

    // 10 km (Verde Esmeralda Medio)
    const c10 = L.circle([this.plantaCentral.lat, this.plantaCentral.lng], {
      radius: 10000,
      color: '#059669',
      fillColor: '#059669',
      fillOpacity: 0.04,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(this.map).bindTooltip('Radio de 10 km: Núcleo de Concesiones Clientes', { sticky: true });
    this.circles.push(c10);

    // 20 km (Verde Bosque Profundo)
    const c20 = L.circle([this.plantaCentral.lat, this.plantaCentral.lng], {
      radius: 20000,
      color: '#047857',
      fillColor: '#047857',
      fillOpacity: 0.02,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(this.map).bindTooltip('Radio de 20 km: Perímetro de Abastecimiento Primario', { sticky: true });
    this.circles.push(c20);

    // Marcador de la Planta Central (PLANPROMIN Shumiral) - Estilo Esmeralda Ecológico
    const centralIcon = L.divIcon({
      html: '<div class="custom-marker marker-central font-black">★</div>',
      className: 'leaflet-custom-icon',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    L.marker([this.plantaCentral.lat, this.plantaCentral.lng], { icon: centralIcon })
      .addTo(this.map)
      .bindPopup(`
        <div class="map-popup-card">
          <h4 class="popup-title text-emerald-400 font-extrabold">${this.plantaCentral.name}</h4>
          <p class="popup-role font-bold text-emerald-400">Complejo Metalúrgico Central</p>
          <p class="popup-address">${this.plantaCentral.description}</p>
        </div>
      `);

    // Agregar marcadores para las relaveras (Verde Bosque Eco)
    this.relaveras.forEach(rel => {
      const relIcon = L.divIcon({
        html: rel.iconHtml,
        className: 'leaflet-custom-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([rel.lat, rel.lng], { icon: relIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="map-popup-card">
            <h4 class="popup-title text-emerald-400 font-black">${rel.name}</h4>
            <p class="popup-role text-teal-400 font-bold">Depósito de Relaves Sostenible</p>
            <div class="popup-address border-t border-zinc-800/80 pt-1.5 mt-1.5 space-y-0.5">
              <div><strong>Capacidad:</strong> ${rel.capacity}</div>
              <div><strong>Ocupación:</strong> ${rel.occupancy}%</div>
              <div><strong>Estado:</strong> <span class="text-emerald-400 font-semibold">${rel.status}</span></div>
            </div>
          </div>
        `);
    });

    // Agregar marcadores y políneas para cada concesión
    this.concesiones.forEach(conc => {
      const customIcon = L.divIcon({
        html: conc.iconHtml,
        className: 'leaflet-custom-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Marcador de Concesión
      const marker = L.marker([conc.lat, conc.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="map-popup-card">
            <h4 class="popup-title text-zinc-100">${conc.name}</h4>
            <p class="popup-role text-teal-400 font-bold">Distancia a Planta: ${conc.distance}</p>
            <p class="popup-address">${conc.description}</p>
          </div>
        `);

      this.markersMap.set(conc.id, marker);

      // Dibujar polilínea desde la concesión a la Planta Central en color verde agua / menta brillante
      const polyline = L.polyline([[this.plantaCentral.lat, this.plantaCentral.lng], [conc.lat, conc.lng]], {
        color: '#14b8a6', // Menta/turquesa brillante
        weight: 3,
        dashArray: '5, 5',
        opacity: 0.9
      }).addTo(this.map);
      this.polylines.push(polyline);

      // Evento de clic en marcador
      marker.on('click', () => {
        this.selectConcesion(conc, false);
      });
    });

    // Agregar leyenda flotante personalizada del mapa en la esquina inferior derecha
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <h5 class="legend-title">Operaciones PLANPROMIN</h5>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-symbol symbol-central">★</span>
            <span class="legend-text">Complejo Shumiral (Planta)</span>
          </div>
          <div class="legend-item">
            <span class="legend-symbol symbol-relavera">R</span>
            <span class="legend-text">Relavera (Depósito)</span>
          </div>
          <div class="legend-item">
            <span class="legend-symbol symbol-concesion">M</span>
            <span class="legend-text">Concesión Aliada</span>
          </div>
          <div class="legend-item">
            <span class="legend-route"></span>
            <span class="legend-text">Ruta de Abastecimiento</span>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(this.map);

    // Centrar en la concesión por defecto
    if (this.selectedConcesion) {
      this.selectConcesion(this.selectedConcesion, true);
    }
  }

  selectConcesion(concesion: Concesion, flyTo = true): void {
    this.selectedConcesion = concesion;
    this.cdr.detectChanges();

    if (this.map && flyTo) {
      // Volar hacia la ubicación de la mina con zoom de detalle (12)
      this.map.flyTo([concesion.lat, concesion.lng], 12, {
        duration: 1.5
      });

      // Abrir popup con un pequeño retardo tras la animación
      const marker = this.markersMap.get(concesion.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 1500);
      }
    }
  }
}
