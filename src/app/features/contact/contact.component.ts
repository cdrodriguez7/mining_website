import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private fb      = inject(FormBuilder);
  private service = inject(ContactService);

  isSubmitting  = false;
  showSuccess   = false;
  showError     = false;
  errorMessage  = '';

  readonly tiposSolicitud = [
    { id: 'cotizacion',  label: 'Solicitar Cotización' },
    { id: 'informacion', label: 'Información General' },
    { id: 'operaciones', label: 'Consulta Operaciones' },
    { id: 'otro',        label: 'Otro' }
  ];

  readonly infoContacto = [
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      titulo: 'Ubicación',
      lineas: ['Sector Shumiral', 'Cantón Camilo Ponce Enríquez', 'Provincia del Azuay, Ecuador']
    },
    {
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      titulo: 'Teléfono',
      lineas: ['+593 7 122 5007', 'Lun - Vie: 8:00 - 18:00']
    },
    {
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      titulo: 'Correo',
      lineas: ['financiero@planpromin.com', 'Respuesta en menos de 24 h']
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      titulo: 'Horario de Atención',
      lineas: ['Lun – Vie: 8:00 AM – 5:00 PM', 'Sáb: 9:00 AM – 1:00 PM']
    }
  ];

  form: FormGroup = this.fb.group({
    tipoSolicitud: ['cotizacion', Validators.required],
    nombre:        ['', [Validators.required, Validators.minLength(3)]],
    empresa:       [''],
    email:         ['', [Validators.required, Validators.email]],
    telefono:      ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
    asunto:        ['', [Validators.required, Validators.minLength(5)]],
    mensaje:       ['', [Validators.required, Validators.minLength(20)]]
  });

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  errorFor(field: string): string {
    const c = this.form.get(field);
    if (c?.hasError('required'))   return 'Campo obligatorio';
    if (c?.hasError('email'))      return 'Email inválido';
    if (c?.hasError('minlength'))  return `Mínimo ${c.errors?.['minlength'].requiredLength} caracteres`;
    if (c?.hasError('pattern'))    return 'Solo números (7-15 dígitos)';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showSuccess  = false;
    this.showError    = false;

    this.service.enviar(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccess  = true;
        this.form.reset({ tipoSolicitud: 'cotizacion' });
        setTimeout(() => document.querySelector('.success-banner')?.scrollIntoView({ behavior: 'smooth' }), 100);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showError    = true;
        this.errorMessage = err?.error?.error ?? 'Error al enviar. Por favor intente nuevamente o contáctenos por teléfono.';
      }
    });
  }
}
