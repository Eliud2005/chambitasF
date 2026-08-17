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

  // Señal reactiva inicializada con las publicaciones de prueba
  jobs = signal<JobPost[]>(this.initialJobs);

  /**
   * Agrega un nuevo trabajo a la lista reactiva
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

    // Actualiza la señal colocando la nueva publicación al inicio del arreglo
    this.jobs.update((currentJobs) => [newJob, ...currentJobs]);
  }
}