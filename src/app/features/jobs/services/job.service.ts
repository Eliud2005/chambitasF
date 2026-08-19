import { Injectable, signal } from '@angular/core';

export type PublicacionEstado = 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA';

export interface JobPost {
  id: string; // CHAR(36) UUID
  clienteId?: string; // CHAR(36) UUID del cliente creador
  oficioId: string; // CHAR(36) UUID del oficio requerido
  oficioNombre?: string; // Para mostrar el nombre en lugar de solo el ID
  titulo: string; // VARCHAR(150)
  descripcion: string; // TEXT
  ubicacion: string; // VARCHAR(200)
  presupuesto?: number; // DECIMAL(10,2)
  estado: PublicacionEstado; // ENUM ('ABIERTA', 'EN_PROGRESO', 'COMPLETADA')
  createdAt: Date | string; // DATETIME(3)
}

export interface CreateJobDto {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  oficioId: string;
  presupuesto?: number;
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly STORAGE_KEY = 'trades_jobs_local_db';

  // Datos iniciales de prueba (Mock Data)
  private initialJobs: JobPost[] = [
    {
      id: crypto.randomUUID(),
      titulo: 'Reparación de fuga de agua en tubería principal',
      descripcion: 'Se requiere plomero para reparar fuga en tubo de PVC de 3/4 en patio trasero. Traer herramienta propia.',
      ubicacion: 'Ocotlán de Morelos',
      oficioId: 'plomeria',
      oficioNombre: 'Plomería',
      presupuesto: 450,
      estado: 'ABIERTA',
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Pintado de fachada de dos pisos',
      descripcion: 'Busco pintor para aplicar sellador y dos manos de pintura vinílica en fachada exterior. Pintura ya disponible.',
      ubicacion: 'Centro',
      oficioId: 'pintura',
      oficioNombre: 'Pintura',
      presupuesto: 1200,
      estado: 'ABIERTA',
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Instalación de pasto sintético y poda',
      descripcion: 'Mantenimiento general de jardín pequeño y colocación de 15m² de pasto sintético.',
      ubicacion: 'Santa Cruz Xoxocotlán',
      oficioId: 'jardineria',
      oficioNombre: 'Jardinería',
      presupuesto: 800,
      estado: 'ABIERTA',
      createdAt: new Date().toISOString(),
    },
  ];

  // Señal reactiva inicializada con lo almacenado en LocalStorage o con los Mocks por defecto
  jobs = signal<JobPost[]>(this.loadFromStorage());

  /**
   * Carga los datos guardados en LocalStorage. 
   * Si es la primera vez que se ejecuta, guarda y retorna los datos de prueba iniciales.
   */
  private loadFromStorage(): JobPost[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.initialJobs;
    }

    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (!savedData) {
      this.saveToStorage(this.initialJobs);
      return this.initialJobs;
    }

    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error al parsear publicaciones guardadas:', error);
      return this.initialJobs;
    }
  }

  /**
   * Serializa y persiste el estado actual de publicaciones en LocalStorage
   */
  private saveToStorage(jobsList: JobPost[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(jobsList));
    }
  }

  /**
   * Agrega un nuevo trabajo a la lista reactiva y lo guarda en LocalStorage
   * @param dto Datos del formulario de creación
   * @param oficioNombre Nombre descriptivo del oficio (opcional)
   */
  addJob(dto: CreateJobDto, oficioNombre?: string): void {
    const newJob: JobPost = {
      id: crypto.randomUUID(),
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      ubicacion: dto.ubicacion,
      oficioId: dto.oficioId,
      oficioNombre: oficioNombre,
      presupuesto: dto.presupuesto,
      estado: 'ABIERTA',
      createdAt: new Date().toISOString(),
    };

    // Actualiza la Signal y sincroniza inmediatamente con LocalStorage
    this.jobs.update((currentJobs) => {
      const updatedList = [newJob, ...currentJobs];
      this.saveToStorage(updatedList);
      return updatedList;
    });
  }
}