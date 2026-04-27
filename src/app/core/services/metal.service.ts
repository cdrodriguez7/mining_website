import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MetalHistoryService } from './metal-history.service';

export interface MetalData {
  price: number;
  /** Diferencia vs. precio de ayer. null = no hay historial previo aún */
  change: number | null;
  /** Porcentaje de cambio. null = no hay historial previo aún */
  changePct: number | null;
  /** Precio de apertura referencial (±% del precio actual) */
  open: number;
  /** Máximo del día referencial */
  high: number;
  /** Mínimo del día referencial */
  low: number;
  unit: string;
  symbol: string;
  label: string;
}

export interface MetalPricesState {
  gold: MetalData;
  silver: MetalData;
  copper: MetalData;
  date: string;
  isLive: boolean;
}

interface MetalpriceApiResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: { [key: string]: number };
}

const STORAGE_KEY = 'planpromin_metals_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface CachedMetals {
  data: MetalPricesState;
  savedAt: number;
}

@Injectable({ providedIn: 'root' })
export class MetalsService {
  private http = inject(HttpClient);
  private historyService = inject(MetalHistoryService);

  private readonly apiUrl = 'https://api.metalpriceapi.com/v1/latest?api_key=25d0e09e06c131e31f3900e844a22fbd&base=USD&currencies=XAU,XAG';

  /** Precios base para fallback cuando la API falla completamente */
  private readonly fallbackPrices = { gold: 3022.50, silver: 33.82, copper: 4.68 };

  /**
   * Devuelve precios desde localStorage si los datos tienen menos de 24h.
   * Solo llama a la API externa si el cache está vacío o expirado.
   */
  getMetalPrices(): Observable<MetalPricesState> {
    const cached = this.readCache();
    if (cached) {
      console.log('[MetalsService] Usando cache (< 24h)');
      return of(cached);
    }
    return this.fetchFromApi();
  }

  /**
   * Ignora el cache y fuerza una nueva llamada a la API.
   * Llamar solo desde el botón "Actualizar".
   */
  refresh(): Observable<MetalPricesState> {
    this.clearCache();
    return this.fetchFromApi();
  }

  private fetchFromApi(): Observable<MetalPricesState> {
    console.log('[MetalsService] Llamando a MetalpriceAPI...');
    return this.http.get<MetalpriceApiResponse>(this.apiUrl).pipe(
      map(res => {
        if (!res?.success || !res?.rates) {
          console.warn('[MetalsService] Respuesta inválida, usando fallback');
          return this.buildState(
            this.fallbackPrices.gold,
            this.fallbackPrices.silver,
            this.fallbackPrices.copper,
            false
          );
        }
        const r = res.rates;
        const goldPrice   = r['USDXAU'] ?? (r['XAU'] ? +(1 / r['XAU']).toFixed(2) : 0);
        const silverPrice = r['USDXAG'] ?? (r['XAG'] ? +(1 / r['XAG']).toFixed(2) : 0);
        const copperPrice = this.fallbackPrices.copper; // cobre no incluido en el plan
        const isLive      = goldPrice > 0 && silverPrice > 0;

        if (!isLive) {
          return this.buildState(
            this.fallbackPrices.gold,
            this.fallbackPrices.silver,
            copperPrice,
            false
          );
        }

        // Registrar en historial ANTES de construir el estado,
        // para que el cambio se calcule vs. el precio de ayer (no el de hoy)
        const prevGold   = this.historyService.getYesterdayPrice('gold');
        const prevSilver = this.historyService.getYesterdayPrice('silver');
        const prevCopper = this.historyService.getYesterdayPrice('copper');

        this.historyService.record(+goldPrice.toFixed(2), +silverPrice.toFixed(2), copperPrice);

        const state = this.buildState(
          +goldPrice.toFixed(2),
          +silverPrice.toFixed(2),
          copperPrice,
          true,
          prevGold,
          prevSilver,
          prevCopper
        );

        this.writeCache(state);
        return state;
      }),
      catchError(err => {
        console.error('[MetalsService] HTTP', err?.status, '—', err?.message);
        return of(this.buildState(
          this.fallbackPrices.gold,
          this.fallbackPrices.silver,
          this.fallbackPrices.copper,
          false
        ));
      })
    );
  }

  private buildState(
    goldPrice: number,
    silverPrice: number,
    copperPrice: number,
    isLive: boolean,
    prevGold?: number | null,
    prevSilver?: number | null,
    prevCopper?: number | null
  ): MetalPricesState {
    return {
      gold: {
        price: goldPrice,
        change:    prevGold != null ? +(goldPrice - prevGold).toFixed(2) : null,
        changePct: prevGold != null ? +((goldPrice - prevGold) / prevGold * 100).toFixed(2) : null,
        ...this.ohlc(goldPrice, 0.006),
        unit: 'USD / oz troy', symbol: 'XAU', label: 'Oro'
      },
      silver: {
        price: silverPrice,
        change:    prevSilver != null ? +(silverPrice - prevSilver).toFixed(2) : null,
        changePct: prevSilver != null ? +((silverPrice - prevSilver) / prevSilver * 100).toFixed(2) : null,
        ...this.ohlc(silverPrice, 0.008),
        unit: 'USD / oz troy', symbol: 'XAG', label: 'Plata'
      },
      copper: {
        price: copperPrice,
        change:    prevCopper != null ? +(copperPrice - prevCopper).toFixed(2) : null,
        changePct: prevCopper != null ? +((copperPrice - prevCopper) / prevCopper * 100).toFixed(2) : null,
        ...this.ohlc(copperPrice, 0.010),
        unit: 'USD / lb', symbol: 'XCU', label: 'Cobre'
      },
      date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
      isLive
    };
  }

  /**
   * Genera valores referenciales de apertura, máximo y mínimo del día
   * basados en el precio actual y una volatilidad típica del metal.
   * open  ≈ precio ± 0.3 × volatilidad
   * high  = max(price, open) + 0.4 × volatilidad × precio
   * low   = min(price, open) - 0.4 × volatilidad × precio
   */
  private ohlc(price: number, vol: number): { open: number; high: number; low: number } {
    const open = +(price * (1 - vol * 0.3)).toFixed(2);
    const high = +(Math.max(price, open) + price * vol * 0.4).toFixed(2);
    const low  = +(Math.min(price, open) - price * vol * 0.4).toFixed(2);
    return { open, high, low };
  }

  private readCache(): MetalPricesState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry: CachedMetals = JSON.parse(raw);

      // Invalida si pasaron más de 24h O si cambió el día calendario,
      // para garantizar que se registre un valor en el historial cada día.
      const saved = new Date(entry.savedAt);
      const savedDay = `${saved.getFullYear()}-${String(saved.getMonth() + 1).padStart(2, '0')}-${String(saved.getDate()).padStart(2, '0')}`;
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (Date.now() - entry.savedAt > TTL_MS || savedDay !== today) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return entry.data;
    } catch { return null; }
  }

  private writeCache(state: MetalPricesState): void {
    try {
      const entry: CachedMetals = { data: state, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch { }
  }

  private clearCache(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
