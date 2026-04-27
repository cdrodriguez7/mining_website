import { Injectable } from '@angular/core';

export interface MetalDayRecord {
  /** ISO date YYYY-MM-DD — clave única por día */
  date: string;
  gold: number;
  silver: number;
  copper: number;
}

const HISTORY_KEY = 'planpromin_metals_history_v1';
const MAX_DAYS = 30;

@Injectable({ providedIn: 'root' })
export class MetalHistoryService {

  /**
   * Graba los precios del día. Si ya existe un registro para hoy lo sobreescribe.
   * Llama esto solo tras un fetch exitoso a la API, nunca desde cache.
   */
  record(gold: number, silver: number, copper: number): void {
    const today = this.todayIso();
    const history = this.load();

    const idx = history.findIndex(r => r.date === today);
    const entry: MetalDayRecord = { date: today, gold, silver, copper };

    if (idx >= 0) {
      history[idx] = entry;
    } else {
      history.push(entry);
    }

    // Ordenar ascendente y recortar a MAX_DAYS
    const trimmed = history
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-MAX_DAYS);

    this.save(trimmed);
  }

  /**
   * Devuelve los últimos `days` registros para el metal solicitado,
   * formateados para Chart.js: [{ label: '6 abr', value: 3020.50 }, ...]
   */
  getHistory(metal: 'gold' | 'silver' | 'copper', days: number): { label: string; value: number }[] {
    return this.load()
      .slice(-days)
      .map(r => ({ label: this.formatDate(r.date), value: r[metal] }));
  }

  /** Número de días registrados en el historial */
  recordCount(): number {
    return this.load().length;
  }

  /**
   * Devuelve el precio del día anterior al de hoy para el metal indicado.
   * Retorna null si no hay registro previo (primer día de uso).
   */
  getYesterdayPrice(metal: 'gold' | 'silver' | 'copper'): number | null {
    const today = this.todayIso();
    const history = this.load();
    // Buscar el registro más reciente que NO sea hoy
    const prev = [...history]
      .sort((a, b) => b.date.localeCompare(a.date))
      .find(r => r.date < today);
    return prev ? prev[metal] : null;
  }

  // ── Helpers privados ───────────────────────────────────────────────────────

  private load(): MetalDayRecord[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save(records: MetalDayRecord[]): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
    } catch { }
  }

  private todayIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-EC', {
      month: 'short',
      day: 'numeric'
    });
  }
}
