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
      description: 'Instalación y reparación de bombas de agua, tinacos, cisternas y fugas en general. Servicio de emergencia las 24 hrs.',
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
      description: 'Electricista certificado. Cortocircuitos, centros de carga, acometidas, balanceo de cargas y cableado residencial.',
      yearsOfExperience: 8,
      rating: 4.7,
      isVerified: true,
    },
    {
      id: 'p3',
      name: 'Roberto Cruz',
      category: 'Herrería',
      location: 'Ocotlán de Morelos',
      phone: '5219510000003',
      description: 'Fabricación de portones, protecciones, techados de lámina y estructura metálica ligera. Presupuestos sin compromiso.',
      yearsOfExperience: 10,
      rating: 4.8,
      isVerified: true,
    },
    {
      id: 'p4',
      name: 'Manuel Hernández',
      category: 'Carpintería',
      location: 'San Felipe del Agua',
      phone: '5219510000004',
      description: 'Fabricación y reparación de muebles a medida, clósets, cocinas integrales, puertas de madera y barnizado.',
      yearsOfExperience: 15,
      rating: 5.0,
      isVerified: false,
    },
    {
      id: 'p5',
      name: 'Jorge Martínez',
      category: 'Pintura',
      location: 'Ocotlán de Morelos',
      phone: '5219510000005',
      description: 'Pintura de fachadas e interiores, impermeabilización de azoteas, resanado de grietas y aplicación de texturizados.',
      yearsOfExperience: 6,
      rating: 4.6,
      isVerified: true,
    },
    {
      id: 'p6',
      name: 'Fernando Aguilar',
      category: 'Cerrajería',
      location: 'Ejutla de Crespo',
      phone: '5219510000006',
      description: 'Apertura de autos y casas, duplicados de llaves con chip, cambio de combinaciones y colocación de cerraduras de alta seguridad.',
      yearsOfExperience: 9,
      rating: 4.9,
      isVerified: true,
    },
    {
      id: 'p7',
      name: 'Don Mateo Ramírez',
      category: 'Albañilería',
      location: 'Ocotlán de Morelos',
      phone: '5219510000007',
      description: 'Construcción en general, pegado de piso, azulejo, colados, bardas, aplanados y remodelaciones completas.',
      yearsOfExperience: 20,
      rating: 4.9,
      isVerified: false,
    },
    {
      id: 'p8',
      name: 'Taller Mecánico El Rayo',
      category: 'Mecánica',
      location: 'Zaachila',
      phone: '5219510000008',
      description: 'Mecánica general, afinaciones, frenos, suspensión y mantenimiento preventivo para automóviles y motocicletas.',
      yearsOfExperience: 11,
      rating: 4.8,
      isVerified: false,
    },
    {
      id: 'p9',
      name: 'Javier Gómez',
      category: 'Refrigeración',
      location: 'Centro',
      phone: '5219510000009',
      description: 'Mantenimiento y reparación de aire acondicionado, minisplits, refrigeradores comerciales y domésticos.',
      yearsOfExperience: 7,
      rating: 4.7,
      isVerified: true,
    },
  ]);

  professionals = this.professionalsSignal.asReadonly();

  addProfessional(professional: Omit<ProfessionalProfile, 'id'>): void {
    const newProf: ProfessionalProfile = {
      ...professional,
      id: `p_${Date.now()}`,
    };
    this.professionalsSignal.update((profs) => [newProf, ...profs]);
  }

  getProfessionalById(id: string): ProfessionalProfile | undefined {
    return this.professionalsSignal().find((p) => p.id === id);
  }
}