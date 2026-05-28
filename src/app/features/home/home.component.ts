import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { ImageSelectorService } from '../../core/services/image-selector.service';
import { CloudinaryImage, SECTION_FOLDERS } from '../../core/models/gallery.model';
import { MetalsService, MetalPricesState, MetalData } from '../../core/services/metal.service';
import { MetalHistoryService } from '../../core/services/metal-history.service';
import { NewsService, NewsItem } from '../../core/services/news.service';
import { Subscription } from 'rxjs';
import { ImagePreviewComponent } from '../../shared/components/image-preview/image-preview.component';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

interface MetalTab {
  key: 'gold' | 'silver' | 'copper';
  label: string;
  symbol: string;
  color: string;
  iconPath: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ImagePreviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  // ── Inyección con inject() — no requiere emitDecoratorMetadata ─────────────
  private cloudinaryService = inject(CloudinaryService);
  private galleryService = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);
  private metalsService = inject(MetalsService);
  private metalHistoryService = inject(MetalHistoryService);
  private newsService = inject(NewsService);
  private cdr = inject(ChangeDetectorRef);


  mapImagePath = 'assets/planpromin_sa.png';

  previewVisible = false;
  previewUrl = '';
  previewTitle = '';
  previewImages: { url: string; title: string; description?: string }[] = [];
  previewIndex = 0;

  // ── Imágenes dinámicas ────────────────────────────────────────────────────
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  aboutImage: CloudinaryImage | null = null;
  galleryPreviewImages: CloudinaryImage[] = [];

  // ── Proyectos de Nuestro Trabajo ──────────────────────────────────────────
  projectModalVisible = false;
  activeProject: any | null = null;
  projectActiveImageIndex = 0;
  projects: any[] = [];



  // ── Metales ───────────────────────────────────────────────────────────────
  metalsLoading   = true;
  metalsRefreshing = false;
  metalPrices: MetalPricesState | null = null;
  activeMetal: 'gold' | 'silver' | 'copper' = 'gold';
  activePeriod = 30;

  periods = [
    { label: '7D', days: 7 },
    { label: '14D', days: 14 },
    { label: '1M', days: 30 }
  ];

  metalsList: MetalTab[] = [
    {
      key: 'gold', label: 'Oro', symbol: 'XAU', color: '#D4A017',
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    },
    {
      key: 'silver', label: 'Plata', symbol: 'XAG', color: '#A8B5C0',
      iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    },
    {
      key: 'copper', label: 'Cobre', symbol: 'XCU', color: '#C47B3A',
      iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z'
    }
  ];

  // ── Tarjetas de servicio ──────────────────────────────────────────────────
  serviceCardImages: CloudinaryImage[] = [];

  // ── Noticias ──────────────────────────────────────────────────────────────
  previewNews: NewsItem[] = [];
  newsLoading    = true;
  newsRefreshing = false;
  private noticiasImages: CloudinaryImage[] = [];

  private chartInstance: Chart | null = null;
  private metalsSub?: Subscription;

  // Constructor vacío — toda la inyección va arriba con inject()
  constructor() { }

  // ── Getters ───────────────────────────────────────────────────────────────
  get activeMetalData(): MetalData | null {
    return this.metalPrices ? this.metalPrices[this.activeMetal] : null;
  }

  get activeMetalColor(): string {
    return this.metalsList.find(m => m.key === this.activeMetal)?.color ?? '#EA580C';
  }

  /** true cuando tenemos al menos 2 puntos reales para el período activo */
  get usingRealHistory(): boolean {
    return this.metalHistoryService.getHistory(this.activeMetal, this.activePeriod).length >= 2;
  }

  /** Días registrados en el historial (para mostrar en footnote) */
  get historyDays(): number {
    return this.metalHistoryService.recordCount();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.loadDynamicImages();
    this.loadMetalPrices();
    this.loadNewsPreview(); // async, corre en paralelo con el resto
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.metalsSub?.unsubscribe();
    this.destroyChart();
  }

  // ── Metales: carga inicial (usa cache de sesión si existe) ───────────────
  private loadMetalPrices(): void {
    this.metalsLoading = true;
    this.metalsSub = this.metalsService.getMetalPrices().subscribe({
      next: (data) => {
        this.metalPrices = data;
        this.metalsLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(), 150);
      },
      error: () => {
        this.metalsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Metales: actualización manual desde botón ─────────────────────────────
  refreshMetalPrices(): void {
    if (this.metalsRefreshing) return;
    this.metalsRefreshing = true;
    this.destroyChart();
    this.metalsService.refresh().subscribe({
      next: (data) => {
        this.metalPrices = data;
        this.metalsRefreshing = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(), 150);
      },
      error: () => {
        this.metalsRefreshing = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Metales: interacción ──────────────────────────────────────────────────
  selectMetal(key: 'gold' | 'silver' | 'copper'): void {
    this.activeMetal = key;
    setTimeout(() => this.renderChart(), 50);
  }

  selectPeriod(days: number): void {
    this.activePeriod = days;
    this.renderChart();
  }

  // ── Chart.js ──────────────────────────────────────────────────────────────
  private destroyChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  /**
   * Devuelve datos para el gráfico. Prioriza el historial real almacenado.
   * Si hay menos de 2 puntos reales, genera datos simulados como fallback
   * para que el gráfico siempre muestre algo desde el primer día.
   */
  private getChartData(): { label: string; value: number }[] {
    if (!this.metalPrices) return [];

    const real = this.metalHistoryService.getHistory(this.activeMetal, this.activePeriod);
    if (real.length >= 2) return real;

    // Fallback simulado — solo hasta que haya suficiente historial real
    const base = this.metalPrices[this.activeMetal].price;
    const volatility = this.activeMetal === 'copper' ? 0.08 : this.activeMetal === 'silver' ? 0.07 : 0.05;
    const pts: { label: string; value: number }[] = [];
    let v = base * (1 - volatility * 0.4);
    const now = new Date();
    for (let i = this.activePeriod; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        v = v + (Math.random() - 0.47) * base * volatility * 0.05;
        v = Math.max(base * 0.82, Math.min(base * 1.18, v));
        pts.push({ label: d.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' }), value: +v.toFixed(4) });
      }
    }
    if (pts.length > 0) pts[pts.length - 1].value = base;
    return pts;
  }

  private renderChart(): void {
    if (!this.metalPrices) return;

    const canvas = document.getElementById('metalPriceChart') as HTMLCanvasElement | null;
    if (!canvas) {
      console.warn('[MetalsChart] Canvas #metalPriceChart no encontrado en el DOM');
      return;
    }

    this.destroyChart();

    const pts = this.getChartData();
    const color = this.activeMetalColor;

    this.chartInstance = new Chart(canvas, {
      type: 'line' as const,
      data: {
        labels: pts.map(p => p.label),
        datasets: [{
          data: pts.map(p => p.value),
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          fill: true,
          backgroundColor: (ctx: any) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, color + '44');
            gradient.addColorStop(1, color + '00');
            return gradient;
          },
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0E2340',
            titleColor: '#8BA3BF',
            bodyColor: '#ffffff',
            borderColor: color,
            borderWidth: 1,
            callbacks: {
              label: (ctx: any) =>
                ` $${ctx.parsed.y.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#5A7A9A',
              font: { size: 11 },
              maxTicksLimit: 8,
              autoSkip: true
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#5A7A9A',
              font: { size: 11 },
              callback: (v: any) =>
                '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })
            },
            position: 'right' as const
          }
        }
      }
    });
  }

  // ── Noticias: carga inicial (usa cache de sesión si existe) ──────────────
  private async loadNewsPreview(): Promise<void> {
    this.newsLoading = true;
    const [, noticiasImgs] = await Promise.all([
      new Promise<void>(resolve => {
        this.newsService.getNews().subscribe({
          next: (news) => { this.previewNews = news.slice(0, 6); resolve(); },
          error: () => resolve()
        });
      }),
      this.galleryService.getNoticiasImages()
    ]);
    this.noticiasImages = noticiasImgs;
    this.newsLoading = false;
    this.cdr.detectChanges();
  }

  // ── Noticias: actualización manual desde botón ────────────────────────────
  async refreshNews(): Promise<void> {
    if (this.newsRefreshing) return;
    this.newsRefreshing = true;
    this.newsService.refresh().subscribe({
      next: (news) => {
        this.previewNews = news.slice(0, 6);
        this.newsRefreshing = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.newsRefreshing = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatNewsDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('es-EC', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch { return ''; }
  }

  truncate(text: string, maxLen = 120): string {
    if (!text) return '';
    const clean = text.replace(/<[^>]*>/g, '');
    return clean.length > maxLen ? clean.slice(0, maxLen).trimEnd() + '…' : clean;
  }

  /**
   * Devuelve la URL de imagen fallback para una noticia sin imagen propia.
   * Usa las imágenes de mineria/noticias/ en Cloudinary, rotadas por índice.
   */
  getFallbackImage(index: number): string {
    if (this.noticiasImages.length > 0) {
      const img = this.noticiasImages[index % this.noticiasImages.length];
      return this.cloudinaryService.getCardUrl(img.publicId, 600);
    }
    return ''; // sin imagen si la carpeta está vacía
  }

  // ── Imágenes dinámicas ────────────────────────────────────────────────────
  async loadDynamicImages(): Promise<void> {
    try {
      this.isLoading = true;
      // Carga home y service card images en paralelo
      const [, serviceImgs] = await Promise.all([
        this.galleryService.initializeForSection(SECTION_FOLDERS.HOME, 3, false),
        this.galleryService.getImagesForSection(SECTION_FOLDERS.OPERACIONES)
      ]);
      const allImages = this.galleryService.getAllImages();
      if (allImages.length > 0) this.selectImages(allImages);
      // Si operaciones no tiene imágenes, usar las de home como fallback
      this.serviceCardImages = serviceImgs.length > 0 ? serviceImgs : allImages;
      this.isLoading = false;
    } catch {
      this.isLoading = false;
    }
  }

  private selectImages(allImages: CloudinaryImage[]): void {
    this.heroImage = this.imageSelectorService.selectImage(allImages, { aspectRatio: 'landscape', minWidth: 800 });
    if (!this.heroImage && allImages.length > 0) this.heroImage = allImages[0];

    this.aboutImage = this.imageSelectorService.selectImage(allImages, { aspectRatio: 'portrait' });
    if (!this.aboutImage) this.aboutImage = this.imageSelectorService.selectImage(allImages, { aspectRatio: 'square' });
    if (!this.aboutImage && allImages.length > 1) {
      this.aboutImage = allImages.find(img => img.publicId !== this.heroImage?.publicId) || allImages[1];
    }

    // Orden ascendente por fecha de subida (primera imagen del folder → primer bloque)
    const sorted = [...allImages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    this.galleryPreviewImages = sorted.slice(0, 9);
    this.initializeProjects();
  }


  getServiceCardUrl(index: number): string {
    if (this.serviceCardImages.length === 0) return '';
    const img = this.serviceCardImages[index % this.serviceCardImages.length];
    return this.cloudinaryService.getCardUrl(img.publicId, 800);
  }

  getHeroImageUrl(): string {
    if (!this.heroImage) return '';
    return this.cloudinaryService.getHeroUrl(this.heroImage.publicId, 1920);
  }

  getAboutImageUrl(): string {
    if (!this.aboutImage) return '';
    return this.cloudinaryService.getResponsiveUrl(this.aboutImage.publicId, 800, 1000);
  }

  getGalleryPreviewUrl(image: CloudinaryImage): string {
    return this.cloudinaryService.getCardUrl(image.publicId, 600);
  }

  openPreview(url: string, title: string, index?: number): void {
    if (index !== undefined && this.galleryPreviewImages.length > 0) {
      this.previewImages = this.galleryPreviewImages.map(img => ({
        url: this.getGalleryPreviewUrl(img),
        title: img.title || '',
        description: img.description || ''
      }));
      this.previewIndex = index;
    } else {
      this.previewImages = [];
      this.previewUrl = url;
      this.previewTitle = title;
    }
    this.previewVisible = true;
  }

  closePreview(): void {
    this.previewVisible = false;
    this.previewImages = [];
  }

  // ── Proyectos de Nuestro Trabajo ──────────────────────────────────────────
  initializeProjects(): void {
    const rawProjects = [
      {
        id: 'planta-beneficio',
        title: 'Planta de Beneficio Ponce Enríquez',
        category: 'Minería de Excelencia',
        shortDescription: 'Procesamiento diario de 1000 toneladas de material de reproceso y 280 toneladas de materiales nuevos.',
        detailedDescription: 'Nuestra planta principal en el cantón Camilo Ponce Enríquez cuenta con tecnología de punta para la molienda, clasificación y concentración. Operamos bajo estrictas normas de seguridad industrial y eficiencia metalúrgica, maximizando la recuperación aurífera y optimizando el consumo energético de las operaciones diarias.',
        location: 'Cantón Camilo Ponce Enríquez, Azuay',
        status: 'Operativo',
        metrics: '1,280 Ton/día de capacidad total | Eficiencia del 92%',
        mainImageIndex: 0
      },
      {
        id: 'opt-relaveras',
        title: 'Optimización de Relaveras Activas',
        category: 'Minería de Excelencia',
        shortDescription: 'Gestión de 6 relaveras de almacenamiento y reproceso bajo los estándares técnicos más exigentes.',
        detailedDescription: 'Operamos y gestionamos 6 depósitos de relaves activos, utilizando ingeniería geotécnica de precisión para garantizar la estabilidad física y química de los depósitos. Este proyecto se enfoca en el control continuo de filtraciones, análisis de taludes y preparación para el reprocesamiento masivo de residuos históricos.',
        location: 'Complejo Operativo Ponce Enríquez',
        status: 'Monitoreo Activo',
        metrics: '6 Relaveras controladas | Monitoreo geotécnico 24/7',
        mainImageIndex: 1
      },
      {
        id: 'calidad-ambiental',
        title: 'Control y Calidad Ambiental',
        category: 'Minería de Excelencia',
        shortDescription: 'Monitoreo en tiempo real de efluentes y aire en todas nuestras operaciones de beneficio.',
        detailedDescription: 'Comprometidos con la minería responsable, implementamos laboratorios locales y sensores automáticos para medir la calidad del agua, el aire y la estabilidad del suelo. Cada proceso de descarga es tratado químicamente para neutralizar componentes antes de cualquier interacción ambiental.',
        location: 'Ponce Enríquez y zonas de influencia',
        status: 'Cumplimiento Continuo',
        metrics: '0 incidentes ambientales | 100% de cumplimiento de normas ecuatorianas',
        mainImageIndex: 2
      },
      {
        id: 'modelado-3d',
        title: 'Modelado 3D y Planificación Minera',
        category: 'Modelando la Industria',
        shortDescription: 'Simulación tridimensional avanzada de toda nuestra infraestructura y depósitos.',
        detailedDescription: 'Empleamos softwares de última generación para recrear gemelos digitales en 3D de las plantas de beneficio, relaveras y túneles. Esto nos permite simular comportamientos geomecánicos, optimizar rutas de transporte de materiales y prever riesgos antes de la fase de ejecución física.',
        location: 'Departamento de Ingeniería y Proyectos',
        status: 'Planificación e Ingeniería',
        metrics: 'Precisión milimétrica | Simulación de riesgos 3D',
        mainImageIndex: 3
      },
      {
        id: 'exploracion-geologica',
        title: 'Exploración Geológica y Sondeos',
        category: 'Modelando la Industria',
        shortDescription: 'Perforación diamantina e identificación de reservas auríferas de alto grado.',
        detailedDescription: 'Llevamos a cabo campañas de exploración geológica sistemática, utilizando perforaciones diamantinas para extraer núcleos y mapear la mineralización profunda. Los datos obtenidos alimentan directamente nuestros estudios de prefactibilidad y estimación de recursos futuros.',
        location: 'Zonas de Concesión Planpromin',
        status: 'Fase de Sondeo',
        metrics: '15,000+ metros de sondeo analizados | Base de datos georeferenciada',
        mainImageIndex: 4
      },
      {
        id: 'prefactibilidad-ingenieria',
        title: 'Prefactibilidad e Ingeniería de Detalle',
        category: 'Modelando la Industria',
        shortDescription: 'Estudios de viabilidad técnica, económica y ambiental para la expansión operativa.',
        detailedDescription: 'Desarrollamos la ingeniería básica y de detalle bajo normativas internacionales. Este proyecto integra el modelamiento económico con análisis de impacto socioambiental, garantizando que cada expansión de infraestructura cuente con viabilidad financiera a largo plazo.',
        location: 'Oficinas Corporativas y de Ingeniería',
        status: 'Aprobado y en Ejecución',
        metrics: 'Estándares NI 43-101 | Diseños aprobados por entes de control',
        mainImageIndex: 5
      },
      {
        id: 'recuperacion-metalurgica',
        title: 'Recuperación Metalúrgica de Relaves',
        category: 'Reprocesamiento de Relaves',
        shortDescription: 'Extracción de oro residual en relaves históricos mediante cianuración y flotación.',
        detailedDescription: 'Pioneros en la recuperación secundaria de metales preciosos. Mediante la optimización de procesos físicos y químicos de flotación y cianuración en circuito cerrado, logramos extraer el oro fino atrapado en relaves antiguos, dando un valor económico real a lo que antes se consideraba desperdicio o residuo.',
        location: 'Circuito de Flotación Avanzada',
        status: 'Operativo',
        metrics: 'Recuperación optimizada | Economía circular',
        mainImageIndex: 6
      },
      {
        id: 'mitigacion-pasivos',
        title: 'Mitigación y Cierre de Pasivos Ambientales',
        category: 'Reprocesamiento de Relaves',
        shortDescription: 'Restauración de depósitos mineros históricos desatendidos en la región.',
        detailedDescription: 'Nos encargamos de mitigar y estabilizar pasivos ambientales generados por la minería histórica informal o de antigua data. Este proyecto incluye la revegetación de taludes, la neutralización de aguas ácidas y la contención definitiva de relaves antiguos para devolver la armonía al ecosistema local.',
        location: 'Áreas históricas de Ponce Enríquez',
        status: 'Mitigación en Proceso',
        metrics: '12 hectáreas recuperadas | Cero drenaje ácido',
        mainImageIndex: 7
      },
      {
        id: 'centralizacion-segura',
        title: 'Centralización Segura y Transporte de Material',
        category: 'Reprocesamiento de Relaves',
        shortDescription: 'Movilización de relaves históricos dispersos hacia un único punto de control seguro.',
        detailedDescription: 'Transportamos de forma segura los relaves dispersos en la geografía del cantón hacia nuestro centro de reprocesamiento centralizado. Con esto, reducimos el número de puntos con impacto ambiental potencial en la región, unificando la contención y facilitando un monitoreo de seguridad altamente eficiente.',
        location: 'Red logística regional',
        status: 'Logística Activa',
        metrics: '100% de transporte cubierto y seguro | Centralización integrada',
        mainImageIndex: 8
      }
    ];

    this.projects = rawProjects.map(proj => {
      const mainImg = this.galleryPreviewImages[proj.mainImageIndex];
      const carouselImages: string[] = [];
      
      if (mainImg) {
        carouselImages.push(this.getGalleryPreviewUrl(mainImg));
      }
      
      // Agregamos imágenes vecinas del mismo bloque como parte de su carrusel
      const blockStart = Math.floor(proj.mainImageIndex / 3) * 3;
      for (let i = 0; i < 3; i++) {
        const neighborIdx = blockStart + i;
        if (neighborIdx !== proj.mainImageIndex && this.galleryPreviewImages[neighborIdx]) {
          carouselImages.push(this.getGalleryPreviewUrl(this.galleryPreviewImages[neighborIdx]));
        }
      }
      
      return {
        ...proj,
        coverUrl: mainImg ? this.getGalleryPreviewUrl(mainImg) : '',
        carouselImages
      };
    });
  }

  openProjectDetails(project: any): void {
    this.activeProject = project;
    this.projectActiveImageIndex = 0;
    this.projectModalVisible = true;
  }

  closeProjectDetails(): void {
    this.projectModalVisible = false;
    this.activeProject = null;
  }

  nextProjectImage(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.activeProject || !this.activeProject.carouselImages.length) return;
    this.projectActiveImageIndex = (this.projectActiveImageIndex + 1) % this.activeProject.carouselImages.length;
  }

  prevProjectImage(event?: Event): void {
    if (event) event.stopPropagation();
    if (!this.activeProject || !this.activeProject.carouselImages.length) return;
    this.projectActiveImageIndex = (this.projectActiveImageIndex - 1 + this.activeProject.carouselImages.length) % this.activeProject.carouselImages.length;
  }

  selectProjectImage(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.projectActiveImageIndex = index;
  }


  @HostListener('document:keydown.arrowRight')
  onProjectArrowRight(): void {
    if (this.projectModalVisible) {
      this.nextProjectImage();
    }
  }

  @HostListener('document:keydown.arrowLeft')
  onProjectArrowLeft(): void {
    if (this.projectModalVisible) {
      this.prevProjectImage();
    }
  }

  @HostListener('document:keydown.escape')
  onProjectEscape(): void {
    if (this.projectModalVisible) {
      this.closeProjectDetails();
    }
  }
}