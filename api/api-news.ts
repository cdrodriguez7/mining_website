import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './environments/environment';

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

export interface NewsResponse {
  success: boolean;
  cached: boolean;
  timestamp: string;
  count: number;
  news: NewsItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/api/news`;
  private cacheKey = 'plampromin_news_cache';
  private cacheTimestampKey = 'plampromin_news_timestamp';
  private cacheDuration = 24 * 60 * 60 * 1000; // 24 horas

  constructor(private http: HttpClient) {}

  /**
   * Obtiene noticias del sector minero
   * Primero intenta desde localStorage (caché), si no hace fetch a la API
   */
  getNews(forceRefresh: boolean = false): Observable<NewsItem[]> {
    // Si forceRefresh, ignorar caché
    if (!forceRefresh) {
      const cachedNews = this.getCachedNews();
      if (cachedNews) {
        console.log('Serving news from localStorage cache');
        return of(cachedNews);
      }
    }

    // Fetch desde API
    return this.http.get<NewsResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          // Guardar en caché local
          this.cacheNews(response.news);
          return response.news;
        }
        throw new Error('Failed to fetch news');
      }),
      catchError(error => {
        console.error('Error fetching news:', error);
        
        // Si hay error, intentar retornar caché aunque esté expirado
        const cachedNews = this.getCachedNews(true);
        if (cachedNews) {
          console.log('Returning expired cache due to API error');
          return of(cachedNews);
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene noticias filtradas por categoría
   */
  getNewsByCategory(category: 'Nacional' | 'Internacional'): Observable<NewsItem[]> {
    return this.getNews().pipe(
      map(news => news.filter(item => item.category === category))
    );
  }

  /**
   * Obtiene las últimas N noticias
   */
  getLatestNews(limit: number = 5): Observable<NewsItem[]> {
    return this.getNews().pipe(
      map(news => news.slice(0, limit))
    );
  }

  /**
   * Busca noticias por palabra clave
   */
  searchNews(keyword: string): Observable<NewsItem[]> {
    return this.getNews().pipe(
      map(news => {
        const lowerKeyword = keyword.toLowerCase();
        return news.filter(item => 
          item.title.toLowerCase().includes(lowerKeyword) ||
          item.description.toLowerCase().includes(lowerKeyword)
        );
      })
    );
  }

  /**
   * Obtiene noticias desde localStorage caché
   */
  private getCachedNews(ignoreExpiration: boolean = false): NewsItem[] | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      const timestamp = localStorage.getItem(this.cacheTimestampKey);

      if (!cached || !timestamp) {
        return null;
      }

      // Verificar si el caché ha expirado
      if (!ignoreExpiration) {
        const cacheAge = Date.now() - parseInt(timestamp);
        if (cacheAge > this.cacheDuration) {
          console.log('Cache expired');
          return null;
        }
      }

      return JSON.parse(cached) as NewsItem[];
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Guarda noticias en localStorage caché
   */
  private cacheNews(news: NewsItem[]): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(news));
      localStorage.setItem(this.cacheTimestampKey, Date.now().toString());
      console.log('News cached successfully');
    } catch (error) {
      console.error('Error caching news:', error);
    }
  }

  /**
   * Limpia el caché manualmente
   */
  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.cacheTimestampKey);
    console.log('News cache cleared');
  }

  /**
   * Fuerza una actualización de noticias
   */
  refreshNews(): Observable<NewsItem[]> {
    this.clearCache();
    return this.getNews(true);
  }

  /**
   * Obtiene información del caché
   */
  getCacheInfo(): { cached: boolean; timestamp: Date | null; age: number | null } {
    const timestamp = localStorage.getItem(this.cacheTimestampKey);
    
    if (!timestamp) {
      return { cached: false, timestamp: null, age: null };
    }

    const timestampNum = parseInt(timestamp);
    const age = Date.now() - timestampNum;

    return {
      cached: true,
      timestamp: new Date(timestampNum),
      age: age
    };
  }
}