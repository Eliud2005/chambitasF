import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL base de la API 
  private apiUrl = 'http://localhost:3000/auth';

  private readonly TOKEN_KEY = 'auth_token';


  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto).pipe(
      tap(response => this.saveToken(response.accessToken))
    );
  }


  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => this.saveToken(response.accessToken))
    );
  }



  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
