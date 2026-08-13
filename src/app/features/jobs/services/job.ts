import { Injectable, signal } from '@angular/core';
import { JobPost } from '../models/job.model'; // Ajusta la ruta a tu modelo

@Injectable({
  providedIn: 'root'
})
export class JobService {
  // Estado inicial simulado
 private jobsSignal = signal<JobPost[]>([
  {
    id: '1',
    title: 'Se busca plomero para reparación de fuga',
    description: 'Fuga urgente en la toma principal de la cocina. Se requiere atención hoy mismo.',
    category: 'Plomería',
    location: 'Centro',
    budget: 350,
    contactPhone: '5219510000001',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Pintor para fachada de casa de 2 pisos',
    description: 'Se busca persona para pintar fachada, material ya comprado. Trabajo de 2 días.',
    category: 'Pintura',
    location: 'Ocotlán de Morelos',
    budget: 1200,
    contactPhone: '5219510000002',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Electricista para instalación de centro de carga',
    description: 'Instalación de interruptor termomagnético y balanceo de cargas en local comercial.',
    category: 'Electricidad',
    location: 'San Felipe del Agua',
    budget: 800,
    contactPhone: '5219510000003',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Carpintero para ajuste de puertas de madera',
    description: 'Cuatro puertas de tambor raspan al cerrar. Mantenimiento y cepillado simple.',
    category: 'Carpintería',
    location: 'Santa Cruz Xoxocotlán',
    budget: 500,
    contactPhone: '5219510000004',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '5',
    title: 'Personal para limpieza profunda de casa',
    description: 'Limpieza post-remodelación en casa de 3 recámaras. Incluye lavado de ventanas.',
    category: 'Limpieza',
    location: 'Reforma',
    budget: 600,
    contactPhone: '5219510000005',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '6',
    title: 'Jardinero para podar pasto y árboles pequeños',
    description: 'Jardín residencial de 80m2. Requiere podadora propia para retirar la maleza.',
    category: 'Jardinería',
    location: 'Xochimilco',
    budget: 400,
    contactPhone: '5219510000006',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '7',
    title: 'Auxiliar de Albañilería / Peón',
    description: 'Apoyo para colado de losa un fin de semana completo. Pago por jornada.',
    category: 'Construcción',
    location: 'Santa Lucía del Camino',
    budget: 450,
    contactPhone: '5219510000007',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '8',
    title: 'Mecánico para afinación mayor de Tsuru',
    description: 'Cambio de bujías, aceite, filtros y lavado de cuerpo de aceleración.',
    category: 'Mecanica',
    location: 'Zaachila',
    budget: 900,
    contactPhone: '5219510000008',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '9',
    title: 'Instalación de tinaco de 1100L en azotea',
    description: 'Subir e instalar tubería de PVC de 3/4 desde la cisterna hasta el tinaco.',
    category: 'Plomería',
    location: 'Etla',
    budget: 750,
    contactPhone: '5219510000009',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '10',
    title: 'Pintura para interiores en departamento',
    description: 'Pintar sala, comedor y dos recámaras en color blanco mate. Pongo la pintura.',
    category: 'Pintura',
    location: 'Reforma',
    budget: 1500,
    contactPhone: '5219510000010',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '11',
    title: 'Cambio de cableado eléctrico viejo',
    description: 'Sustitución de cableado en 3 recámaras por calibre 12 normado.',
    category: 'Electricidad',
    location: 'Ocotlán de Morelos',
    budget: 1100,
    contactPhone: '5219510000011',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '12',
    title: 'Fabricación de clóset a medida',
    description: 'Cotización e instalación de clóset de MDF o pino de 2x2.4 metros.',
    category: 'Carpintería',
    location: 'San Felipe del Agua',
    budget: 3500,
    contactPhone: '5219510000012',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '13',
    title: 'Lavado de salas y colchones a domicilio',
    description: 'Limpieza con inyección-extracción para sala esquinera de 5 puestos.',
    category: 'Limpieza',
    location: 'Santa Cruz Xoxocotlán',
    budget: 700,
    contactPhone: '5219510000013',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '14',
    title: 'Diseño e instalación de sistema de riego',
    description: 'Riego por goteo para área verde pequeña con programador automático.',
    category: 'Jardinería',
    location: 'Centro',
    budget: 1800,
    contactPhone: '5219510000014',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '15',
    title: 'Resanado de muro por humedad',
    description: 'Retirar repellado dañado, aplicar sellador impermeabilizante y aplanar.',
    category: 'Construcción',
    location: 'Etla',
    budget: 650,
    contactPhone: '5219510000015',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '16',
    title: 'Revisión de frenos y suspensión de motocicleta',
    description: 'Cambio de balatas delanteras/traseras y ajuste de cadena para moto 150cc.',
    category: 'Mecanica',
    location: 'Ocotlán de Morelos',
    budget: 300,
    contactPhone: '5219510000016',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '17',
    title: 'Reparación de bomba de agua de 1/2 HP',
    description: 'La bomba enciende pero no sube agua a la azotea. Revisión de sello o impulsor.',
    category: 'Plomería',
    location: 'Santa Lucía del Camino',
    budget: 400,
    contactPhone: '5219510000017',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '18',
    title: 'Colocación de azulejo en baño',
    description: 'Mano de obra para pegar 15 m2 de loseta cerámica en piso y paredes de baño.',
    category: 'Construcción',
    location: 'Zaachila',
    budget: 2200,
    contactPhone: '5219510000018',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '19',
    title: 'Instalación de 4 lámparas LED y contactos',
    description: 'Colocar spots LED sobre falso plafón y reemplazar 3 contactos dobles.',
    category: 'Electricidad',
    location: 'Xochimilco',
    budget: 500,
    contactPhone: '5219510000019',
    status: 'OPEN',
    createdAt: new Date()
  },
  {
    id: '20',
    title: 'Barnizado de comedor de 6 sillas',
    description: 'Lijado y aplicación de barniz marino en mesa de comedor de madera sólida.',
    category: 'Carpintería',
    location: 'Centro',
    budget: 950,
    contactPhone: '5219510000020',
    status: 'OPEN',
    createdAt: new Date()
  }
]);

  // Signal pública de solo lectura
  jobs = this.jobsSignal.asReadonly();

  // Función para simular agregar un nuevo trabajo desde el formulario
  addJob(newJobData: Omit<JobPost, 'id' | 'createdAt' | 'status'>) {
    const newJob: JobPost = {
      ...newJobData,
      id: Date.now().toString(),
      status: 'OPEN',
      createdAt: new Date()
    };
    
    // Actualizamos el signal agregando el nuevo elemento al inicio
    this.jobsSignal.update(currentJobs => [newJob, ...currentJobs]);
  }
}