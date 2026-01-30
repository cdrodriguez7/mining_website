import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Inicio - Transparencia Minera Ponce Enríquez'
  },
  {
    path: 'compania',
    loadComponent: () => import('./features/company/company.component')
      .then(m => m.CompanyComponent),
    title: 'Compañía - Transparencia Minera'
  },
  {
    path: 'servicios',
    loadComponent: () => import('./features/services/services.component')
      .then(m => m.ServicesComponent),
    title: 'Servicios - Transparencia Minera'
  },
  {
    path: 'sobrevuelo-drones',
    loadComponent: () => import('./features/drone-flights/drone-flights.component')
      .then(m => m.DroneFlightsComponent),
    title: 'Sobrevuelo de Drones - Transparencia Minera'
  },
  {
    path: 'galeria',
    loadComponent: () => import('./features/gallery/gallery.component')
      .then(m => m.GalleryComponent),
    title: 'Galería - Transparencia Minera'
  },
  {
    path: 'galeria/:phase',
    loadComponent: () => import('./features/gallery/gallery.component')
      .then(m => m.GalleryComponent),
    title: 'Galería - Transparencia Minera'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contact/contact.component')
      .then(m => m.ContactComponent),
    title: 'Contacto - Transparencia Minera'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
