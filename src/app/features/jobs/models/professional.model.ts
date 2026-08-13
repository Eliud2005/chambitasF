export interface ProfessionalProfile {
  id: string;
  name: string;
  category: string; // Ej: 'Plomería', 'Electricidad'
  location: string; // Ej: 'Ocotlán de Morelos', 'Centro'
  phone: string;
  description: string;
  yearsOfExperience: number;
  rating?: number; // Ej: 4.8
  isVerified?: boolean;
  avatarUrl?: string;
}