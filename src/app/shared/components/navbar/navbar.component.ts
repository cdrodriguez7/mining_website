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
  private closeTimeout: any = null;

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
        { label: 'Información Corporativa', route: '/empresa/informacion-corporativa' }
      ]
    },
    {
      label: 'Inversores',
      children: [
        { label: 'Resumen', route: '/inversores' },
        { label: 'Precio de Acción', route: '/inversores/precio-accion' },
        { label: 'Presentaciones', route: '/inversores/presentaciones' },
        { label: 'Eventos', route: '/inversores/eventos' },
        { label: 'Estados Financieros', route: '/inversores/estados-financieros' },
        { label: 'Cobertura de Analistas', route: '/inversores/cobertura-analistas' },
        { label: 'Forma de Información Anual', route: '/inversores/forma-informacion-anual' },
        { label: 'Materiales de Junta', route: '/inversores/materiales-junta' },
        { label: 'Dividendos', route: '/inversores/dividendos' },
      ]
    },
    {
      label: 'Operaciones',
      children: [
        {
          label: 'Camilo Ponce Enríquez',
          children: [
            { label: 'Visión General', route: '/operaciones/camilo-ponce-enriquez' },
            { label: 'Historia', route: '/operaciones/camilo-ponce-enriquez/historia' },
            { label: 'Geología y Mineralización', route: '/operaciones/camilo-ponce-enriquez/geologia' },
            { label: 'Estado Operativo', route: '/operaciones/camilo-ponce-enriquez/operativo' },
            { label: 'Guía de Producción', route: '/operaciones/camilo-ponce-enriquez/proyecciones' }
          ]
        },
        { label: 'Exploración', route: '/operaciones/exploracion' },
        { label: 'Guía y Perspectivas', route: '/operaciones/guia-perspectivas' },
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
        { label: 'Cambio Climático', route: '/mineria-responsable/cambio-climatico' },
        { label: 'Compromiso con Comunidades', route: '/mineria-responsable/comunidades' },
        { label: 'Estrategia 5 Años', route: '/mineria-responsable/estrategia-5-anos' },
        { label: 'Reportes de Sostenibilidad', route: '/mineria-responsable/reportes-sostenibilidad' },
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
    }
  }

  toggleDropdown(label: string) {
    this.openDropdown = this.openDropdown === label ? null : label;
  }

  isDropdownOpen(label: string): boolean {
    return this.openDropdown === label;
  }

  openMenu(label: string) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.openDropdown = label;
  }

  closeMenu() {
    this.closeTimeout = setTimeout(() => {
      this.openDropdown = null;
      this.closeTimeout = null;
    }, 200);
  }

  cancelClose() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  closeAllDropdowns() {
    this.openDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeAllDropdowns();
    }
  }
}