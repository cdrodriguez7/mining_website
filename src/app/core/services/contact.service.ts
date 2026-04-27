import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  tipoSolicitud: string;
  nombre: string;
  empresa?: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export interface ContactResponse {
  success: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  enviar(data: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>('/api/contact', data);
  }
}
