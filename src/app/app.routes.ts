import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  
  // ===== EMPRESA =====
  {
    path: 'empresa',
    children: [
      {
        path: '',
        redirectTo: 'acerca-de',
        pathMatch: 'full'
      },
      {
        path: 'acerca-de',
        loadComponent: () => import('./features/empresa/acerca-de/acerca-de.component').then(m => m.AcercaDeComponent)
      },
      {
        path: 'gerencia',
        loadComponent: () => import('./features/empresa/gerencia/gerencia.component').then(m => m.GerenciaComponent)
      },
      {
        path: 'directorio',
        loadComponent: () => import('./features/empresa/directorio/directorio.component').then(m => m.DirectorioComponent)
      },
      {
        path: 'gobierno-corporativo',  // ✅ CORREGIDO: era "gobierno-corporativo-main"
        children: [
          {
            path: '',
            loadComponent: () => import('./features/empresa/gobierno-corporativo-main/gobierno-corporativo.component').then(m => m.GobiernoCorporativoComponent)
          },
          {
            path: 'practicas',
            loadComponent: () => import('./features/empresa/gobierno-corporativo-practicas/practicas.component').then(m => m.PracticasComponent)
          },
          {
            path: 'documentos',
            loadComponent: () => import('./features/empresa/gobierno-corporativo-documentos/documentos.component').then(m => m.DocumentosComponent)
          },
          {
            path: 'politicas',
            loadComponent: () => import('./features/empresa/gobierno-corporativo-politicas/politicas.component').then(m => m.PoliticasComponent)
          },
          {
            path: 'denuncias',
            loadComponent: () => import('./features/empresa/gobierno-corporativo-denuncias/denuncias.component').then(m => m.DenunciasComponent)
          }
        ]
      },
      {
        path: 'informacion-corporativa',
        loadComponent: () => import('./features/empresa/informacion-corporativa/informacion-corporativa.component').then(m => m.InformacionCorporativaComponent)
      }
    ]
  },

  // ===== INVERSORES =====
  {
    path: 'inversores',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/inversores/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'precio-accion',  // ✅ DESCOMENTADO
        loadComponent: () => import('./features/inversores/precio-accion/precio-accion.component').then(m => m.PrecioAccionComponent)
      },
      {
        path: 'presentaciones',
        loadComponent: () => import('./features/inversores/presentaciones/presentaciones.component').then(m => m.PresentacionesComponent)
      },
      {
        path: 'eventos',
        loadComponent: () => import('./features/inversores/eventos/eventos.component').then(m => m.EventosComponent)
      },
      {
        path: 'estados-financieros',
        loadComponent: () => import('./features/inversores/estados-financieros/estados-financieros.component').then(m => m.EstadosFinancierosComponent)
      },
      {
        path: 'cobertura-analistas',
        loadComponent: () => import('./features/inversores/cobertura-analistas/cobertura-analistas.component').then(m => m.CoberturaAnalistasComponent)
      },
      {
        path: 'forma-informacion-anual',
        loadComponent: () => import('./features/inversores/forma-informacion-anual/forma-informacion-anual.component').then(m => m.FormaInformacionAnualComponent)
      },
      {
        path: 'materiales-junta',
        loadComponent: () => import('./features/inversores/materiales-junta/materiales-junta.component').then(m => m.MaterialesJuntaComponent)
      },
      {
        path: 'dividendos',
        loadComponent: () => import('./features/inversores/dividendos/dividendos.component').then(m => m.DividendosComponent)
      },
      {
        path: 'informacion-adicional',
        children: [
          {
            path: 'inversores-eeuu',
            loadComponent: () => import('./features/inversores/inversores-eeuu/inversores-eeuu.component').then(m => m.InversoresEeuuComponent)  // ✅ AGREGADO loadComponent
          },
          {
            path: 'inversores-suecia',
            loadComponent: () => import('./features/inversores/inversores-suecia/inversores-suecia.component').then(m => m.InversoresSueciaComponent)  // ✅ AGREGADO loadComponent
          }
        ]
      }
    ]
  },

  // ===== OPERACIONES =====
  {
    path: 'operaciones',
    children: [
      {
        path: '',
        redirectTo: 'fruta-del-norte',
        pathMatch: 'full'
      },
      {
        path: 'fruta-del-norte',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/operaciones/fdn-overview/overview.component').then(m => m.OverviewComponent)  // ✅ DESCOMENTADO
          },
          {
            path: 'historia',
            loadComponent: () => import('./features/operaciones/fdn-historia/historia.component').then(m => m.HistoriaComponent)
          },
          {
            path: 'geologia',
            loadComponent: () => import('./features/operaciones/fdn-geologia/geologia.component').then(m => m.GeologiaComponent)
          },
          {
            path: 'operativo',
            loadComponent: () => import('./features/operaciones/fdn-operativo/operativo.component').then(m => m.OperativoComponent)
          },
          {
            path: 'proyecciones',
            loadComponent: () => import('./features/operaciones/fdn-proyecciones/proyecciones.component').then(m => m.ProyeccionesComponent)
          }
        ]
      },
      {
        path: 'exploracion',
        loadComponent: () => import('./features/operaciones/exploracion/exploracion.component').then(m => m.ExploracionComponent)
      },
      {
        path: 'guia-perspectivas',
        loadComponent: () => import('./features/operaciones/guia-perspectivas/guia-perspectivas.component').then(m => m.GuiaPerspectivasComponent)
      },
      {
        path: 'reservas-recursos',
        loadComponent: () => import('./features/operaciones/reservas-recursos/reservas-recursos.component').then(m => m.ReservasRecursosComponent)
      },
      {
        path: 'reporte-tecnico',
        loadComponent: () => import('./features/operaciones/reporte-tecnico/reporte-tecnico.component').then(m => m.ReporteTecnicoComponent)
      }
    ]
  },

  // ===== MINERÍA RESPONSABLE =====
  {
    path: 'mineria-responsable',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/mineria-responsable/overview/overview.component').then(m => m.MrOverviewComponent)
      },
      {
        path: 'politica',
        loadComponent: () => import('./features/mineria-responsable/politica/politica.component').then(m => m.PoliticaComponent)
      },
      {
        path: 'salud-seguridad',  // ✅ DESCOMENTADO
        loadComponent: () => import('./features/mineria-responsable/salud-seguridad/salud-seguridad.component').then(m => m.SaludSeguridadComponent)
      },
      {
        path: 'medio-ambiente',
        loadComponent: () => import('./features/mineria-responsable/medio-ambiente/medio-ambiente.component').then(m => m.MedioAmbienteComponent)
      },
      {
        path: 'cambio-climatico',
        loadComponent: () => import('./features/mineria-responsable/cambio-climatico/cambio-climatico.component').then(m => m.CambioClimaticoComponent)
      },
      {
        path: 'comunidades',
        loadComponent: () => import('./features/mineria-responsable/comunidades/comunidades.component').then(m => m.ComunidadesComponent)
      },
      {
        path: 'gobernanza',
        loadComponent: () => import('./features/mineria-responsable/gobernanza/gobernanza.component').then(m => m.GobernanzaComponent)
      },
      {
        path: 'estrategia-5-anos',
        loadComponent: () => import('./features/mineria-responsable/estrategia-5-anos/estrategia-5-anos.component').then(m => m.Estrategia5AnosComponent)
      },
      {
        path: 'reportes-sostenibilidad',
        loadComponent: () => import('./features/mineria-responsable/reportes-sostenibilidad/reportes-sostenibilidad.component').then(m => m.ReportesSostenibilidadComponent)
      },
      {
        path: 'reporte-esclavitud-moderna',
        loadComponent: () => import('./features/mineria-responsable/reporte-esclavitud-moderna/reporte-esclavitud-moderna.component').then(m => m.ReporteEsclavitudModernaComponent)
      },
      {
        path: 'otros-reportes',
        children: [
          {
            path: 'estma',
            loadComponent: () => import('./features/mineria-responsable/otros-reportes-estma/estma.component').then(m => m.EstmaComponent)
          },
          {
            path: 'impacto-ambiental',
            loadComponent: () => import('./features/mineria-responsable/otros-reportes-impacto-ambiental/impacto-ambiental.component').then(m => m.ImpactoAmbientalComponent)
          },
          {
            path: 'arqueologia',
            loadComponent: () => import('./features/mineria-responsable/otros-reportes-arqueologia/arqueologia.component').then(m => m.ArqueologiaComponent)
          }
        ]
      },
      {
        path: 'compromisos-membresias',
        loadComponent: () => import('./features/mineria-responsable/compromisos-membresias/compromisos-membresias.component').then(m => m.CompromisosMembresiasComponent)
      }
    ]
  },

  // ===== NOTICIAS =====
  {
    path: 'noticias',
    loadComponent: () => import('./features/noticias/noticias-main/noticias.component').then(m => m.NoticiasComponent)  // ✅ DESCOMENTADO Y CORREGIDO PATH
  },
  {
    path: 'noticias/:ano',
    loadComponent: () => import('./features/noticias/noticias-ano/noticias-ano.component').then(m => m.NoticiasAnoComponent)
  },

  // ===== CARRERAS =====
  {
    path: 'carreras',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/carreras/carreras-main/carreras.component').then(m => m.CarrerasComponent)  // ✅ DESCOMENTADO
      },
      {
        path: 'vacantes',
        loadComponent: () => import('./features/carreras/vacantes/vacantes.component').then(m => m.VacantesComponent)  // ✅ DESCOMENTADO
      },
      {
        path: 'preguntas-frecuentes',
        loadComponent: () => import('./features/carreras/preguntas-frecuentes/preguntas-frecuentes.component').then(m => m.PreguntasFrecuentesComponent)
      },
      {
        path: 'por-que-trabajar',
        loadComponent: () => import('./features/carreras/por-que-trabajar/por-que-trabajar.component').then(m => m.PorQueTrabajarComponent)
      },
      {
        path: 'alerta-fraude',
        loadComponent: () => import('./features/carreras/alerta-fraude/alerta-fraude.component').then(m => m.AlertaFraudeComponent)
      }
    ]
  },

  // ===== CONTACTO =====
  {
    path: 'contacto',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },

  // ===== GALERÍA =====
  {
    path: 'galeria',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/gallery/gallery.component').then(m => m.GalleryComponent)  // ✅ DESCOMENTADO (nota: carpeta es "gallery")
      },
      {
        path: 'subir',
        loadComponent: () => import('./features/gallery/upload.component').then(m => m.UploadComponent)  // ✅ DESCOMENTADO
      }
    ]
  },
  // ===== 404 =====
  {
    path: '**',
    redirectTo: ''
  }
];
