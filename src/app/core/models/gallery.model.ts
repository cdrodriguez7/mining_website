export interface CloudinaryImage {
  publicId: string;
  title: string;
  description: string;
  folder: string;       // último segmento del assetFolder (ej: "noticias")
  assetFolder?: string; // Location completa en Cloudinary (ej: "mineria/noticias")
  tags: string[];
  width: number;
  height: number;
  format: string;
  createdAt: Date;
  secureUrl: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  displayName: string;
  description: string;
  path: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

/**
 * Carpetas de Cloudinary por sección del sitio.
 *
 * Estructura en Cloudinary Media Library:
 *   mineria/
 *   ├── home/           → heroes del homepage, vistas panorámicas del cantón CPE
 *   ├── empresa/        → reuniones ejecutivas, oficinas, equipo directivo
 *   ├── operaciones/    → maquinaria, pit, planta de beneficio, voladuras
 *   ├── geologia/       → muestras de roca, núcleos, mapas, laboratorio
 *   ├── seguridad/      → EPP, capacitaciones QHSE, brigadas de emergencia
 *   ├── medio-ambiente/ → ríos, reforestación, monitoreo hídrico, fauna/flora
 *   ├── comunidades/    → eventos sociales, escuelas, infraestructura comunitaria
 *   ├── noticias/       → imágenes referenciales para noticias sin foto propia
 *   └── galeria/        → selección curada de imágenes destacadas
 *
 * La GALERÍA muestra todas las imágenes bajo mineria/ (todos los subfolderes).
 * Cada sección carga solo su carpeta; si está vacía, cae a mineria/ como fallback.
 */
export const SECTION_FOLDERS = {
  HOME:           'mineria/home',
  EMPRESA:        'mineria/empresa',
  OPERACIONES:    'mineria/operaciones',
  GEOLOGIA:       'mineria/geologia',
  SEGURIDAD:      'mineria/seguridad',
  MEDIO_AMBIENTE: 'mineria/medio-ambiente',
  COMUNIDADES:    'mineria/comunidades',
  NOTICIAS:       'mineria/noticias',
  GALERIA:        'mineria/galeria',
  ALL:            'mineria',
} as const;

export type SectionFolder = typeof SECTION_FOLDERS[keyof typeof SECTION_FOLDERS];

/**
 * Definición de carpetas visibles en la galería pública.
 * El id debe coincidir exactamente con el nombre de subcarpeta en Cloudinary
 * (último segmento del path), ya que api/images.ts extrae folder de public_id.
 */
export const GALLERY_FOLDERS: GalleryFolder[] = [
  {
    id: 'all',
    name: 'all',
    displayName: 'Todas',
    path: 'mineria',
    description: 'Todas las categorías'
  },
  {
    id: 'operaciones',
    name: 'operaciones',
    displayName: 'Operaciones',
    path: 'mineria/operaciones',
    description: 'Maquinaria, pit, planta de beneficio'
  },
  {
    id: 'geologia',
    name: 'geologia',
    displayName: 'Geología',
    path: 'mineria/geologia',
    description: 'Muestras de roca, sondeos, laboratorio geológico'
  },
  {
    id: 'medio-ambiente',
    name: 'medio-ambiente',
    displayName: 'Medio Ambiente',
    path: 'mineria/medio-ambiente',
    description: 'Ríos, reforestación, monitoreo ambiental'
  },
  {
    id: 'seguridad',
    name: 'seguridad',
    displayName: 'Seguridad',
    path: 'mineria/seguridad',
    description: 'EPP, capacitaciones QHSE, brigadas de emergencia'
  },
  {
    id: 'comunidades',
    name: 'comunidades',
    displayName: 'Comunidades',
    path: 'mineria/comunidades',
    description: 'Inversión social, educación, infraestructura comunitaria'
  },
  {
    id: 'empresa',
    name: 'empresa',
    displayName: 'Empresa',
    path: 'mineria/empresa',
    description: 'Contexto corporativo y equipo directivo'
  },
  {
    id: 'home',
    name: 'home',
    displayName: 'Portada',
    path: 'mineria/home',
    description: 'Imágenes de portada e impacto visual'
  },
  {
    id: 'noticias',
    name: 'noticias',
    displayName: 'Noticias',
    path: 'mineria/noticias',
    description: 'Imágenes referenciales del sector minero'
  },
  {
    id: 'galeria',
    name: 'galeria',
    displayName: 'Destacadas',
    path: 'mineria/galeria',
    description: 'Selección curada de imágenes destacadas'
  }
];
