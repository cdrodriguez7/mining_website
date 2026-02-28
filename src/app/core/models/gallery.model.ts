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

export const GALLERY_FOLDERS: GalleryFolder[] = [
  {
    id: 'all',
    name: 'all',
    displayName: 'Todas',
    path: 'mineria',
    description: 'Todas las categorías'
  },
  {
    id: 'maquinaria',
    name: 'maquinaria',
    displayName: 'Maquinaria',
    path: 'mineria',
    description: 'Equipos y maquinaria minera'
  }
];
