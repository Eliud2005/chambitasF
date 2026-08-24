import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, Role, User } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Signal con el tipo estricto User
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.currentUserSignal());
  userRole = computed(() => this.currentUserSignal()?.rol as Role | undefined);

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/register`, dto).pipe(
      map(res => res.data || res),
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, dto).pipe(
      map(res => res.data || res),
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const token = response?.accessToken || (response as any)?.access_token;

    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);

      if (response.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUserSignal.set(response.user);
      }
    }
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}