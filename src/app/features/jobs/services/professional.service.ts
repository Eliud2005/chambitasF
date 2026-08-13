import { Injectable, signal } from '@angular/core';
import { ProfessionalProfile } from '../models/professional.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private professionalsSignal = signal<ProfessionalProfile[]>([
    {
      id: 'p1',
      name: 'José Luis Mendoza',
      category: 'Plomería',
      location: 'Ocotlán de Morelos',
      phone: '5219510000001',
      description: 'Instalación y reparación de bombas de agua, tinacos, cisternas y fugas en general. Atiendo emergencias.',
      yearsOfExperience: 12,
      rating: 4.9,
      isVerified: true,
    },
    {
      id: 'p2',
      name: 'Carlos Ramos',
      category: 'Electricidad',
      location: 'Centro',
      phone: '5219510000002',
      description: 'Electricista certificado. Cortocircuitos, centros de carga, acometidas y cableado residencial.',
      yearsOfExperience: 8,
      rating: 4.7,
      isVerified: true,
    },
    {
      id: 'p3',
      name: 'Manuel Hernández',
      category: 'Carpintería',
      location: 'San Felipe del Agua',
      phone: '5219510000003',
      description: 'Fabricación y reparación de muebles a medida, clósets, cocinas integrales y barnizado.',
      yearsOfExperience: 15,
      rating: 5.0,
      isVerified: false,
    },
    {
      id: 'p4',
      name: 'Jorge Martínez',
      category: 'Pintura',
      location: 'Ocotlán de Morelos',
      phone: '5219510000004',
      description: 'Pintura de fachadas, interiores, impermeabilización de azoteas y resanado de grietas.',
      yearsOfExperience: 6,
      rating: 4.6,
      isVerified: true,
    },
    {
      id: 'p5',
      name: 'Taller Mecánico El Rayo',
      category: 'Mecanica',
      location: 'Zaachila',
      phone: '5219510000005',
      description: 'Mecánica general, afinaciones, frenos y mantenimiento de motocicletas y automóviles.',
      yearsOfExperience: 10,
      rating: 4.8,
      isVerified: false,
    },
  ]);

  professionals = this.professionalsSignal.asReadonly();

  addProfessional(professional: Omit<ProfessionalProfile, 'id'>) {
    const newProf: ProfessionalProfile = {
      ...professional,
      id: Date.now().toString(),
    };
    this.professionalsSignal.update((profs) => [newProf, ...profs]);
  }
}