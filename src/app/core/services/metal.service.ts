import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class MetalsService {

  // inject() en lugar de constructor — coherente con el componente
  private http = inject(HttpClient);

  private apiKey  = environment.metalpriceApiKey ?? 'TU_API_KEY_AQUI';
  private baseUrl = '/metalprice/v1';

  // Solo XAU y XAG — COPPER no está en el plan gratuito de MetalpriceAPI
  private readonly SYMBOLS = 'XAU,XAG';

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
      // Siempre referencial — MetalpriceAPI free no incluye cobre
      price: 4.68, change: 0.07, changePct: 1.52,
      open: 4.61, high: 4.72, low: 4.58,
      bid: 4.67, ask: 4.69,
      yearHigh: 5.10, yearLow: 3.55,
      unit: 'USD / lb', symbol: 'XCU', label: 'Cobre'
    },
    date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
    isLive: false
  };

  getMetalPrices(): Observable<MetalPricesState> {
    const url = `${this.baseUrl}/latest?api_key=${this.apiKey}&base=USD&currencies=${this.SYMBOLS}`;

    return this.http.get<MetalpriceApiResponse>(url).pipe(
      map(res => {
        if (!res?.success || !res?.rates) {
          console.warn('[MetalsService] Respuesta inválida, usando fallback');
          return this.fallback;
        }

        const r = res.rates;
        const goldPrice   = r['USDXAU'] ?? (r['XAU'] ? +(1 / r['XAU']).toFixed(2) : 0);
        const silverPrice = r['USDXAG'] ?? (r['XAG'] ? +(1 / r['XAG']).toFixed(2) : 0);
        const isLive      = goldPrice > 0 && silverPrice > 0;

        return {
          gold:   { ...this.fallback.gold,   price: isLive ? +goldPrice.toFixed(2)   : this.fallback.gold.price },
          silver: { ...this.fallback.silver, price: isLive ? +silverPrice.toFixed(2) : this.fallback.silver.price },
          copper: { ...this.fallback.copper },
          date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
          isLive
        };
      }),
      catchError(err => {
        const body = err?.error;
        console.error('[MetalsService] HTTP', err?.status, '—', body?.error?.info ?? err?.message);
        return of(this.fallback);
      })
    );
  }
}