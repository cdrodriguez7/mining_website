export interface GalleryItem {
  _id: string;
  stepId: string;
  phaseId: string;
  type: 'photo' | 'document' | 'diagram';
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  fileSize?: number;
  altText: string;
  tags: string[];
  order: number;
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}