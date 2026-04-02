import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  image?: string;
  category: string;
}

interface NewsResponse {
  success: boolean;
  timestamp: string;
  count: number;
  news: NewsItem[];
}

const STORAGE_KEY = 'plampromin_news_v2';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

interface CachedNews {
  items: NewsItem[];
  savedAt: number;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);

  /**
   * Devuelve noticias desde localStorage si los datos tienen menos de 7 días.
   * Solo llama a /api/news si el cache está vacío o expirado.
   */
  getNews(): Observable<NewsItem[]> {
    const cached = this.readCache();
    if (cached) {
      console.log('[NewsService] Usando cache (< 7 días)');
      return of(cached);
    }
    return this.fetchFromApi();
  }

  /**
   * Ignora el cache y fuerza una nueva llamada a la API.
   * Llamar solo desde el botón "Actualizar".
   */
  refresh(): Observable<NewsItem[]> {
    this.clearCache();
    return this.fetchFromApi();
  }

  private fetchFromApi(): Observable<NewsItem[]> {
    console.log('[NewsService] Llamando a /api/news...');
    return this.http.get<NewsResponse>('/api/news').pipe(
      map(r => {
        if (!r.success) throw new Error('API error');
        this.writeCache(r.news);
        return r.news;
      }),
      catchError(() => {
        // Si falla el fetch, devuelve lo que haya en cache aunque haya expirado
        return of(this.readCacheRaw() ?? []);
      })
    );
  }

  private readCache(): NewsItem[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry: CachedNews = JSON.parse(raw);
      if (Date.now() - entry.savedAt > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return entry.items;
    } catch { return null; }
  }

  /** Lee el cache sin verificar TTL — usado como último recurso si la API falla. */
  private readCacheRaw(): NewsItem[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry: CachedNews = JSON.parse(raw);
      return entry.items ?? null;
    } catch { return null; }
  }

  private writeCache(items: NewsItem[]): void {
    try {
      const entry: CachedNews = { items, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch { }
  }

  private clearCache(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
