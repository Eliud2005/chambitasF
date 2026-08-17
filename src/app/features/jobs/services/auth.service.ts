import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, Role } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth'; // Ajusta el puerto/ruta de tu backend NestJS
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_data';

  // Signals para el estado global de la sesión
  private currentUserSignal = signal<AuthResponse['user'] | null>(this.getUserFromStorage());
  
  // Computeds para consultar el estado desde cualquier componente
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.currentUserSignal());
  userRole = computed(() => this.currentUserSignal()?.rol as Role | undefined);

  /**
   * Iniciar Sesión (POST /auth/login)
   */
  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => this.handleAuthSuccess(response))
    );
  }

  /**
   * Registrar Cliente o Trabajador (POST /auth/register)
   */
  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, dto).pipe(
      tap((response) => this.handleAuthSuccess(response))
    );
  }

  /**
   * Cerrar Sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obtener el JWT almacenado (Usado por el Functional Interceptor)
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guardar sesión en LocalStorage y actualizar Signal
   */
  private handleAuthSuccess(response: AuthResponse): void {
    if (response.accessToken) {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSignal.set(response.user);
    }
  }

  /**
   * Recuperar usuario guardado al recargar la aplicación
   */
  private getUserFromStorage(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}