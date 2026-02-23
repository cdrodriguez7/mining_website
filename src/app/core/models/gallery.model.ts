export interface CloudinaryImage {
  publicId: string;
  title: string;
  description: string;
  folder: string;
  tags: string[];
  width: number;
  height: number;
  format: string;
  createdAt: Date;
  secureUrl: string;
}

export interface GalleryFolder {
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

export const GALLERY_FOLDERS: GalleryFolder[] = [
  {
    name: 'maquinaria',
    displayName: 'Maquinaria',
    description: 'Equipos y maquinaria pesada',
    path: 'mineria/maquinaria'
  },
  {
    name: 'extraccion',
    displayName: 'Extracción de Mineral',
    description: 'Procesos de extracción y minería',
    path: 'mineria/extraccion'
  },
  {
    name: 'infraestructura',
    displayName: 'Infraestructura',
    description: 'Instalaciones y construcciones',
    path: 'mineria/infraestructura'
  },
  {
    name: 'procesamiento',
    displayName: 'Procesamiento',
    description: 'Plantas de procesamiento',
    path: 'mineria/procesamiento'
  },
  {
    name: 'seguridad',
    displayName: 'Seguridad',
    description: 'Equipos de protección y seguridad',
    path: 'mineria/seguridad'
  },
  {
    name: 'medio-ambiente',
    displayName: 'Medio Ambiente',
    description: 'Sostenibilidad y cuidado ambiental',
    path: 'mineria/medio-ambiente'
  }
];