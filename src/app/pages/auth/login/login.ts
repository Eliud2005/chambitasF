import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Ajusta la ruta a tu AuthService unificado

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading: boolean = false;
  errorMessage: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    // Petición HTTP al backend (NestJS -> Prisma -> MariaDB)
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Redirigir al feed de empleos tras iniciar sesión exitosamente
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.isLoading = false;
        // Capturar el mensaje de error que regresa NestJS (ej: 401 Unauthorized)
        this.errorMessage = err?.error?.message || 'Correo o contraseña incorrectos.';
      }
    });
  }
}