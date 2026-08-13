export interface JobPost {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: number;
  contactPhone: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
}