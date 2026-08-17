import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oficio, ProfessionalProfile, Review } from '../models/professional.model';

export interface ProfessionalFilter {
  oficioId?: string;
  zona?: string;
  disponible?: boolean;
  q?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private http = inject(HttpClient);
  
  // URL base apuntando a la API REST de NestJS
  private readonly API_URL = 'http://localhost:3000/api';

  // Signals para manejar el estado global de profesionales y catálogo de oficios
  private professionalsSignal = signal<ProfessionalProfile[]>([]);
  private oficiosSignal = signal<Oficio[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Readonly Signals expuestas a los componentes
  professionals = this.professionalsSignal.asReadonly();
  oficios = this.oficiosSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();

  /**
   * Carga el catálogo público de oficios desde NestJS (GET /api/oficios)
   */
  loadOficios(): void {
    this.http.get<Oficio[]>(`${this.API_URL}/oficios`).subscribe({
      next: (data) => this.oficiosSignal.set(data),
      error: (err) => console.error('Error al cargar catálogo de oficios:', err),
    });
  }

  /**
   * Obtener lista de trabajadores filtrada desde NestJS (GET /api/trabajadores)
   * Acepta query params: oficioId, zona (cobertura), disponible, q
   */
  loadProfessionals(filters?: ProfessionalFilter): void {
    this.loadingSignal.set(true);
    let params = new HttpParams();

    if (filters?.oficioId) {
      params = params.set('oficioId', filters.oficioId);
    }
    if (filters?.zona) {
      params = params.set('zona', filters.zona);
    }
    if (filters?.disponible !== undefined) {
      params = params.set('disponible', filters.disponible.toString());
    }
    if (filters?.q) {
      params = params.set('q', filters.q);
    }

    this.http.get<ProfessionalProfile[]>(`${this.API_URL}/trabajadores`, { params }).subscribe({
      next: (data) => {
        this.professionalsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la lista de trabajadores:', err);
        this.loadingSignal.set(false);
      },
    });
  }

  /**
   * Obtener el perfil público detallado de un trabajador por ID (GET /api/trabajadores/:id)
   * Incluye la relación con Usuario, PerfilTrabajador, Oficios y promedio de calificación.
   */
  getProfessionalById(id: string): Observable<ProfessionalProfile> {
    return this.http.get<ProfessionalProfile>(`${this.API_URL}/trabajadores/${id}`);
  }

  /**
   * Obtener el listado de reseñas escritas para un trabajador (GET /api/trabajadores/:id/resenas)
   */
  getProfessionalReviews(trabajadorId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/trabajadores/${trabajadorId}/resenas`);
  }
}