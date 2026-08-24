import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';

  registerForm: FormGroup = this.fb.group({
    rol: ['TRABAJADOR', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    zonaCobertura: [''],
    experiencia: [''],
    descripcion: ['']
  });

  isWorker(): boolean {
    return this.registerForm.get('rol')?.value === 'TRABAJADOR';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = { ...this.registerForm.value };

    // Si el usuario no es trabajador, limpiamos los datos de perfil para evitar enviar cadenas vacías
    if (!this.isWorker()) {
      delete formData.zonaCobertura;
      delete formData.experiencia;
      delete formData.descripcion;
    }

    // Petición HTTP al backend (NestJS -> Prisma / TypeORM)
    this.authService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Ocurrió un error al registrar la cuenta.';
      }
    });
  }
}