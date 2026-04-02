import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
export interface MetalData {
  price: number;
  change: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  yearHigh: number;
  yearLow: number;
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

const STORAGE_KEY = 'plampromin_metals_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface CachedMetals {
  data: MetalPricesState;
  savedAt: number;
}

@Injectable({ providedIn: 'root' })
export class MetalsService {
  private http = inject(HttpClient);
  // Llama directo a MetalpriceAPI desde el browser (soporta CORS).
  // Funciona en dev y producción sin proxy ni serverless.
  private readonly apiUrl = 'https://api.metalpriceapi.com/v1/latest?api_key=25d0e09e06c131e31f3900e844a22fbd&base=USD&currencies=XAU,XAG';

  private readonly fallback: MetalPricesState = {
    gold: {
      price: 3022.50, change: 32.10, changePct: 1.08,
      open: 2988.00, high: 3085.00, low: 2971.00,
      bid: 3021.00, ask: 3024.00,
      yearHigh: 3167.00, yearLow: 1820.00,
      unit: 'USD / oz troy', symbol: 'XAU', label: 'Oro'
    },
    silver: {
      price: 33.82, change: 0.60, changePct: 1.81,
      open: 33.20, high: 34.10, low: 33.05,
      bid: 33.78, ask: 33.86,
      yearHigh: 35.40, yearLow: 21.50,
      unit: 'USD / oz troy', symbol: 'XAG', label: 'Plata'
    },
    copper: {
      price: 4.68, change: 0.07, changePct: 1.52,
      open: 4.61, high: 4.72, low: 4.58,
      bid: 4.67, ask: 4.69,
      yearHigh: 5.10, yearLow: 3.55,
      unit: 'USD / lb', symbol: 'XCU', label: 'Cobre'
    },
    date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
    isLive: false
  };

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
          return this.fallback;
        }
        const r = res.rates;
        const goldPrice   = r['USDXAU'] ?? (r['XAU'] ? +(1 / r['XAU']).toFixed(2) : 0);
        const silverPrice = r['USDXAG'] ?? (r['XAG'] ? +(1 / r['XAG']).toFixed(2) : 0);
        const isLive      = goldPrice > 0 && silverPrice > 0;
        const state: MetalPricesState = {
          gold:   { ...this.fallback.gold,   price: isLive ? +goldPrice.toFixed(2)   : this.fallback.gold.price },
          silver: { ...this.fallback.silver, price: isLive ? +silverPrice.toFixed(2) : this.fallback.silver.price },
          copper: { ...this.fallback.copper },
          date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
          isLive
        };
        this.writeCache(state);
        return state;
      }),
      catchError(err => {
        console.error('[MetalsService] HTTP', err?.status, '—', err?.message);
        return of(this.fallback);
      })
    );
  }

  private readCache(): MetalPricesState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry: CachedMetals = JSON.parse(raw);
      if (Date.now() - entry.savedAt > TTL_MS) {
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
