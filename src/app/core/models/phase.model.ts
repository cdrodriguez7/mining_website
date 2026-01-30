export interface Phase {
  _id: string;
  phaseNumber: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  estimatedDuration: string;
  createdAt: Date;
  updatedAt: Date;
}
