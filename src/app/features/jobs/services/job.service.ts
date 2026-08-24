import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export type PublicacionEstado = 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA';

export interface Oficio {
  id: string; // CHAR(36) UUID
  nombre: string; // VARCHAR(100)
  descripcion?: string;
  icono?: string;
}

export interface JobPost {
  id: string; // CHAR(36) UUID
  clienteId?: string; // CHAR(36) UUID del cliente creador
  oficioId: string; // CHAR(36) UUID del oficio requerido
  oficio?: {
    id: string;
    nombre: string;
  };
  oficioNombre?: string;
  titulo: string; // VARCHAR(150)
  descripcion: string; // TEXT
  ubicacion: string; // VARCHAR(200)
  presupuesto?: number; // DECIMAL(10,2)
  estado?: PublicacionEstado; // ENUM ('ABIERTA', 'EN_PROGRESO', 'COMPLETADA')
  createdAt?: Date | string; // DATETIME(3)
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
  private http = inject(HttpClient);

  // Base de la API con el prefijo global 'api/v1'
  private readonly API_BASE_URL = 'http://localhost:3000/api/v1';
  private readonly API_URL = `${this.API_BASE_URL}/publicaciones`;

  // Estado privado con Signals
  private _jobs = signal<JobPost[]>([]);

  // Señal pública de solo lectura para los componentes
  readonly jobs = this._jobs.asReadonly();

  /**
   * Obtiene el catálogo completo de oficios desde la BD
   */
  getOficios(): Observable<Oficio[]> {
    return this.http.get<any>(`${this.API_BASE_URL}/oficios`).pipe(
      map((res) => (res.data ? res.data : res))
    );
  }

  /**
   * Carga la lista de empleos llamando a la API y actualizando el Signal.
   */
  loadJobs(): void {
    this.getJobs().subscribe({
      error: (err: any) => console.error('Error al cargar las publicaciones de empleo:', err),
    });
  }

  /**
   * Obtiene todas las publicaciones desde el backend y actualiza la señal
   */
  getJobs(): Observable<JobPost[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map((res) => (res.data ? res.data : res)),
      tap((data: JobPost[]) => this._jobs.set(data))
    );
  }

  /**
   * Obtiene una publicación específica por su ID
   */
  getJobById(id: string): Observable<JobPost> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map((res) => (res.data ? res.data : res))
    );
  }

  /**
   * Crea una nueva publicación en la BD y actualiza la lista local de forma reactiva
   */
  addJob(dto: CreateJobDto): Observable<JobPost> {
    return this.http.post<any>(this.API_URL, dto).pipe(
      map((res) => (res.data ? res.data : res)),
      tap((newJob: JobPost) => {
        this._jobs.update((current) => [newJob, ...current]);
      })
    );
  }

  /**
   * Elimina una publicación por ID en la BD y la remueve del estado local
   */
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this._jobs.update((current) => current.filter((job) => job.id !== id));
      })
    );
  }

  /**
   * Actualiza el estado de una publicación (ABIERTA | EN_PROGRESO | COMPLETADA)
   */
  updateJobStatus(id: string, nuevoEstado: PublicacionEstado): Observable<JobPost> {
    return this.http.patch<any>(`${this.API_URL}/${id}/estado`, { estado: nuevoEstado }).pipe(
      map((res) => (res.data ? res.data : res)),
      tap((updatedJob: JobPost) => {
        this._jobs.update((current) =>
          current.map((job) => (job.id === id ? updatedJob : job))
        );
      })
    );
  }
}