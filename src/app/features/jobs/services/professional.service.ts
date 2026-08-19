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
  
  // Clave para guardar en el navegador de forma temporal
  private readonly STORAGE_KEY = 'local_professionals_data';

  // URL base apuntando a la API REST de NestJS
  private readonly API_URL = 'http://localhost:3000/api';

  // Signals para manejar el estado global
  private professionalsSignal = signal<ProfessionalProfile[]>([]);
  private oficiosSignal = signal<Oficio[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Readonly Signals expuestas a los componentes
  professionals = this.professionalsSignal.asReadonly();
  oficios = this.oficiosSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();

  constructor() {
    // Carga inicial de datos locales si existen
    this.loadLocalProfessionals();
  }

  /**
   * Carga los profesionales guardados localmente
   */
  private getLocalProfessionals(): ProfessionalProfile[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private loadLocalProfessionals(): void {
    const local = this.getLocalProfessionals();
    if (local.length > 0) {
      this.professionalsSignal.set(local);
    }
  }

  /**
   * Registra un nuevo profesional localmente en localStorage y en la señal
   */
  registerLocalProfessional(dto: RegisterProfessionalDto): void {
    const newProfile: ProfessionalProfile = {
      id: crypto.randomUUID(),
      usuario: {
        id: crypto.randomUUID(),
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        telefono: dto.telefono,
      },
      experiencia: dto.experiencia,
      descripcion: dto.descripcion,
      zonaCobertura: dto.zonaCobertura,
      disponible: true,
      calificacionPromedio: 5.0,
      oficios: dto.oficioId ? [{ id: dto.oficioId, nombre: 'Oficio Seleccionado' }] : [],
      createdAt: new Date().toISOString(),
    } as unknown as ProfessionalProfile; // Casteo según el modelo ProfessionalProfile

    const localActuales = this.getLocalProfessionals();
    const actualizados = [newProfile, ...localActuales];

    // Guarda en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actualizados));

    // Actualiza la señal reactiva
    this.professionalsSignal.update((current) => [newProfile, ...current]);
  }

  /**
   * Carga catálogo público de oficios (GET /api/oficios)
   */
  loadOficios(): void {
    this.http.get<Oficio[]>(`${this.API_URL}/oficios`).subscribe({
      next: (data) => this.oficiosSignal.set(data),
      error: (err) => console.error('Error al cargar catálogo de oficios:', err),
    });
  }

  /**
   * Obtener lista de trabajadores filtrada desde NestJS (GET /api/trabajadores)
   * Si la API falla (por estar offline), mantiene los datos guardados en localStorage.
   */
  loadProfessionals(filters?: ProfessionalFilter): void {
    this.loadingSignal.set(true);
    let params = new HttpParams();

    if (filters?.oficioId) params = params.set('oficioId', filters.oficioId);
    if (filters?.zona) params = params.set('zona', filters.zona);
    if (filters?.disponible !== undefined) params = params.set('disponible', filters.disponible.toString());
    if (filters?.q) params = params.set('q', filters.q);

    this.http.get<ProfessionalProfile[]>(`${this.API_URL}/trabajadores`, { params }).subscribe({
      next: (apiData) => {
        const localData = this.getLocalProfessionals();
        // Fusiona datos del backend con los guardados en localStorage
        this.professionalsSignal.set([...localData, ...apiData]);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.warn('Backend offline o inalcanzable. Usando datos de localStorage.', err);
        this.loadLocalProfessionals();
        this.loadingSignal.set(false);
      },
    });
  }

  getProfessionalById(id: string): Observable<ProfessionalProfile> {
    return this.http.get<ProfessionalProfile>(`${this.API_URL}/trabajadores/${id}`);
  }

  getProfessionalReviews(trabajadorId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/trabajadores/${trabajadorId}/resenas`);
  }
}