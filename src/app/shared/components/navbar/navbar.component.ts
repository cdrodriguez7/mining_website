import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  openDropdown: string | null = null;
  openNestedDropdown: string | null = null;

  menuItems: MenuItem[] = [
    { label: 'Inicio', route: '/' },
    {
      label: 'Empresa',
      children: [
        { label: 'Acerca de Nosotros', route: '/empresa/acerca-de' },
        { label: 'Gerencia', route: '/empresa/gerencia' },
        { label: 'Directorio', route: '/empresa/directorio' },
        {
          label: 'Gobierno Corporativo',
          children: [
            { label: 'Prácticas de Gobernanza', route: '/empresa/gobierno-corporativo/practicas' },
            { label: 'Documentos de Gobernanza', route: '/empresa/gobierno-corporativo/documentos' },
            { label: 'Políticas Centrales', route: '/empresa/gobierno-corporativo/politicas' },
            { label: 'Política de Denuncias', route: '/empresa/gobierno-corporativo/denuncias' }
          ]
        },
      ]
    },
    {
      label: 'Camilo Ponce Enríquez',
      children: [
        { label: 'Visión General', route: '/operaciones/ponce-enriquez/overview' },
        { label: 'Historia', route: '/operaciones/ponce-enriquez/historia' },
        { label: 'Geología y Mineralización', route: '/operaciones/ponce-enriquez/geologia' },
        { label: 'Estado Operativo', route: '/operaciones/ponce-enriquez/operativo' },
        { label: 'Guía de Producción', route: '/operaciones/ponce-enriquez/proyecciones' },
        { label: 'Exploración', route: '/operaciones/exploracion' },
        { label: 'Reservas y Recursos', route: '/operaciones/reservas-recursos' },
        { label: 'Reporte Técnico', route: '/operaciones/reporte-tecnico' }
      ]
    },
    {
      label: 'Minería Responsable',
      children: [
        { label: 'Resumen', route: '/mineria-responsable' },
        { label: 'Política de Minería Responsable', route: '/mineria-responsable/politica' },
        { label: 'Salud y Seguridad', route: '/mineria-responsable/salud-seguridad' },
        { label: 'Medio Ambiente', route: '/mineria-responsable/medio-ambiente' },
        { label: 'Estrategia 5 Años', route: '/mineria-responsable/estrategia-5-anos' },
        { label: 'Compromisos y Membresías', route: '/mineria-responsable/compromisos-membresias' }
      ]
    },
    { label: 'Noticias', route: '/noticias' },
    { label: 'Galería', route: '/galeria' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.openDropdown = null;
      this.openNestedDropdown = null;
    }
  }

  toggleDropdown(label: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdown === label) {
      this.openDropdown = null;
      this.openNestedDropdown = null;
    } else {
      this.openDropdown = label;
      this.openNestedDropdown = null;
    }
  }

  toggleNestedDropdown(label: string, event: Event) {
    event.stopPropagation();
    this.openNestedDropdown = this.openNestedDropdown === label ? null : label;
  }

  isDropdownOpen(label: string): boolean {
    return this.openDropdown === label;
  }

  isNestedDropdownOpen(label: string): boolean {
    return this.openNestedDropdown === label;
  }

  closeAllDropdowns() {
    this.openDropdown = null;
    this.openNestedDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeAllDropdowns();
    }
  }
}
