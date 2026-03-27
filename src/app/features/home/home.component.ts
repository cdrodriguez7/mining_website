import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CloudinaryService } from '../../core/services/cloudinary.services';
import { GalleryService } from '../../core/services/gallery.service';
import { ImageSelectorService } from '../../core/services/image-selector.service';
import { CloudinaryImage } from '../../core/models/gallery.model';
import { MetalsService, MetalPricesState, MetalData } from '../../core/services/metal.service';
import { Subscription } from 'rxjs';

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
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  // ── Inyección con inject() — no requiere emitDecoratorMetadata ─────────────
  private cloudinaryService    = inject(CloudinaryService);
  private galleryService       = inject(GalleryService);
  private imageSelectorService = inject(ImageSelectorService);
  private metalsService        = inject(MetalsService);
  private cdr                  = inject(ChangeDetectorRef);

  // ── Imágenes dinámicas ────────────────────────────────────────────────────
  isLoading = true;
  heroImage: CloudinaryImage | null = null;
  aboutImage: CloudinaryImage | null = null;
  galleryPreviewImages: CloudinaryImage[] = [];

  // ── Metales ───────────────────────────────────────────────────────────────
  metalsLoading = true;
  metalPrices: MetalPricesState | null = null;
  activeMetal: 'gold' | 'silver' | 'copper' = 'gold';
  activePeriod = 30;

  periods = [
    { label: '1M', days: 30  },
    { label: '3M', days: 90  },
    { label: '6M', days: 180 },
    { label: '1A', days: 365 }
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

  private chartInstance: Chart | null = null;
  private metalsSub?: Subscription;

  // Constructor vacío — toda la inyección va arriba con inject()
  constructor() {}

  // ── Getters ───────────────────────────────────────────────────────────────
  get activeMetalData(): MetalData | null {
    return this.metalPrices ? this.metalPrices[this.activeMetal] : null;
  }

  get activeMetalColor(): string {
    return this.metalsList.find(m => m.key === this.activeMetal)?.color ?? '#EA580C';
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.loadDynamicImages();
    this.loadMetalPrices();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.metalsSub?.unsubscribe();
    this.destroyChart();
  }

  // ── Metales: carga ────────────────────────────────────────────────────────
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

  private generateHistory(
    base: number,
    days: number,
    volatility: number
  ): { label: string; value: number }[] {
    const pts: { label: string; value: number }[] = [];
    let v = base * (1 - volatility * 0.4);
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        v = v + (Math.random() - 0.47) * base * volatility * 0.05;
        v = Math.max(base * 0.82, Math.min(base * 1.18, v));
        pts.push({
          label: d.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' }),
          value: +v.toFixed(4)
        });
      }
    }

    if (pts.length > 0 && this.metalPrices) {
      pts[pts.length - 1].value = this.metalPrices[this.activeMetal].price;
    }

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

    const volatility =
      this.activeMetal === 'copper' ? 0.08 :
      this.activeMetal === 'silver' ? 0.07 : 0.05;

    const pts   = this.generateHistory(this.metalPrices[this.activeMetal].price, this.activePeriod, volatility);
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

  // ── Imágenes dinámicas (lógica original intacta) ──────────────────────────
  async loadDynamicImages(): Promise<void> {
    try {
      this.isLoading = true;
      await this.galleryService.initialize();
      let allImages = this.galleryService.getAllImages();

      if (allImages.length === 0) allImages = this.getUploadedImages();
      if (allImages.length === 0) { this.isLoading = false; return; }

      this.selectImages(allImages);
      this.isLoading = false;
    } catch {
      const localImages = this.getUploadedImages();
      if (localImages.length > 0) this.selectImages(localImages);
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

    const usedIds = [this.heroImage?.publicId, this.aboutImage?.publicId].filter(Boolean);
    const availableForGallery = allImages.filter(img => !usedIds.includes(img.publicId));
    this.galleryPreviewImages = this.imageSelectorService.selectImages(
      availableForGallery.length > 0 ? availableForGallery : allImages,
      { aspectRatio: 'any' },
      6
    );
  }

  private getUploadedImages(): CloudinaryImage[] {
    try {
      const stored = localStorage.getItem('uploadedImages');
      if (stored) {
        const images: CloudinaryImage[] = JSON.parse(stored);
        images.forEach(img => { img.createdAt = new Date(img.createdAt); });
        return images;
      }
    } catch {}
    return [];
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
}