import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="min-h-screen bg-dark-950 pt-32 pb-20">
      <div class="container-custom max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display font-bold text-white mb-6">
            <span class="gradient-text">Contacto</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre los procesos mineros? Estamos aquí para ayudarte
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="bg-dark-800 rounded-2xl p-8">
            <h2 class="text-2xl font-display font-bold text-white mb-6">
              Envíanos un mensaje
            </h2>
            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="block text-gray-300 mb-2" for="name">Nombre completo</label>
                <input 
                  type="text" 
                  id="name"
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors">
              </div>
              <div>
                <label class="block text-gray-300 mb-2" for="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors">
              </div>
              <div>
                <label class="block text-gray-300 mb-2" for="subject">Asunto</label>
                <input 
                  type="text" 
                  id="subject"
                  [(ngModel)]="formData.subject"
                  name="subject"
                  required
                  class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors">
              </div>
              <div>
                <label class="block text-gray-300 mb-2" for="message">Mensaje</label>
                <textarea 
                  id="message"
                  [(ngModel)]="formData.message"
                  name="message"
                  rows="5"
                  required
                  class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors resize-none"></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">
                Enviar Mensaje
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="bg-dark-800 rounded-2xl p-8">
              <div class="text-4xl mb-4">📍</div>
              <h3 class="text-xl font-display font-bold text-white mb-3">Ubicación</h3>
              <p class="text-gray-300">
                Cantón Ponce Enríquez<br>
                Provincia del Azuay<br>
                Ecuador
              </p>
            </div>

            <div class="bg-dark-800 rounded-2xl p-8">
              <div class="text-4xl mb-4">📧</div>
              <h3 class="text-xl font-display font-bold text-white mb-3">Email</h3>
              <p class="text-gray-300">
                info&#64;transparenciaminera.ec
              </p>
            </div>

            <div class="bg-dark-800 rounded-2xl p-8">
              <div class="text-4xl mb-4">📞</div>
              <h3 class="text-xl font-display font-bold text-white mb-3">Teléfono</h3>
              <p class="text-gray-300">
                +593 XX XXX XXXX
              </p>
            </div>

            <div class="bg-dark-800 rounded-2xl p-8">
              <div class="text-4xl mb-4">🕐</div>
              <h3 class="text-xl font-display font-bold text-white mb-3">Horario</h3>
              <p class="text-gray-300">
                Lunes a Viernes: 8:00 AM - 5:00 PM<br>
                Sábados: 9:00 AM - 1:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    alert('Mensaje enviado correctamente. Te contactaremos pronto.');
    this.formData = { name: '', email: '', subject: '', message: '' };
  }
}