import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Oficio, ProfessionalProfile, Review } from '../models/professional.model';

export interface ProfessionalFilter {
  oficioId?: string;
  zona?: string;
  disponible?: boolean;
  q?: string;
}

export interface RegisterProfessionalDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  zonaCobertura: string;
  experiencia: string;
  descripcion: string;
  oficioId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private http = inject(HttpClient);

  // URL base apuntando al prefijo global api/v1 de NestJS
  private readonly API_URL = 'http://localhost:3000/api/v1';

  // Signals para manejar el estado global de forma reactiva
  private professionalsSignal = signal<ProfessionalProfile[]>([]);
  private oficiosSignal = signal<Oficio[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Readonly Signals expuestas a los componentes
  professionals = this.professionalsSignal.asReadonly();
  oficios = this.oficiosSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();

  /**
   * Carga el catálogo público de oficios (GET /api/v1/oficios)
   */
  loadOficios(): void {
    this.http.get<any>(`${this.API_URL}/oficios`).pipe(
      map((res) => (res.data ? res.data : res))
    ).subscribe({
      next: (data: Oficio[]) => this.oficiosSignal.set(data),
      error: (err) => console.error('Error al cargar catálogo de oficios:', err),
    });
  }

  /**
   * Obtener lista de trabajadores filtrada (GET /api/v1/trabajadores)
   */
  loadProfessionals(filters?: ProfessionalFilter): void {
    this.loadingSignal.set(true);
    let params = new HttpParams();

    if (filters?.oficioId) params = params.set('oficioId', filters.oficioId);
    if (filters?.zona) params = params.set('zona', filters.zona);
    if (filters?.disponible !== undefined) params = params.set('disponible', filters.disponible.toString());
    if (filters?.q) params = params.set('q', filters.q);

    this.http.get<any>(`${this.API_URL}/trabajadores`, { params }).pipe(
      map((res) => (res.data ? res.data : res))
    ).subscribe({
      next: (apiData: ProfessionalProfile[]) => {
        this.professionalsSignal.set(apiData);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error al consultar trabajadores en la base de datos:', err);
        this.professionalsSignal.set([]);
        this.loadingSignal.set(false);
      },
    });
  }

  /**
   * Registra un nuevo profesional mediante POST HTTP (POST /api/v1/trabajadores)
   */
  registerProfessional(dto: RegisterProfessionalDto): Observable<ProfessionalProfile> {
    return this.http.post<any>(`${this.API_URL}/trabajadores`, dto).pipe(
      map((res) => (res.data ? res.data : res)),
      tap((newProfile: ProfessionalProfile) => {
        this.professionalsSignal.update((current) => [newProfile, ...current]);
      })
    );
  }

  /**
   * Obtiene la información detallada de un profesional por su ID (GET /api/v1/trabajadores/:id)
   */
  getProfessionalById(id: string): Observable<ProfessionalProfile> {
    return this.http.get<any>(`${this.API_URL}/trabajadores/${id}`).pipe(
      map((res) => (res.data ? res.data : res))
    );
  }

  /**
   * Obtiene la lista de reseñas de un trabajador específico (GET /api/v1/trabajadores/:id/resenas)
   */
  getProfessionalReviews(trabajadorId: string): Observable<Review[]> {
    return this.http.get<any>(`${this.API_URL}/trabajadores/${trabajadorId}/resenas`).pipe(
      map((res) => (res.data ? res.data : res))
    );
  }
}