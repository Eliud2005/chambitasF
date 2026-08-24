import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfessionalService } from '../../services/professional.service';
import { RegisterDto } from '../../models/auth.model';

@Component({
  selector: 'app-professional-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './professional-form.html',
})
export class ProfessionalForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private professionalService = inject(ProfessionalService);
  private router = inject(Router);

  formSubmitted = output<void>();

  // Estados de carga y error para la UI
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Municipios / Zonas de cobertura
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca',
    'Otra zona',
  ];

  // Formulario alineado con RegisterDto (Rol TRABAJADOR)
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    zonaCobertura: ['', [Validators.required]],
    experiencia: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const val = this.form.value;

    // DTO exacto para NestJS (POST /auth/register)
    const registerData: RegisterDto = {
      nombre: val.nombre,
      apellido: val.apellido,
      email: val.email,
      password: val.password,
      telefono: val.telefono,
      rol: 'TRABAJADOR',
      zonaCobertura: val.zonaCobertura,
      experiencia: val.experiencia,
      descripcion: val.descripcion,
    };

    // Petición directa a la base de datos a través de la API
    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Recarga la lista global de profesionales desde la BD
        this.professionalService.loadProfessionals();
        this.formSubmitted.emit();
        this.router.navigate(['/profesional-feed']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al registrar el profesional en la base de datos:', err);
        this.errorMessage.set(
          err?.error?.message || 'No se pudo completar el registro. Intenta nuevamente.'
        );
      },
    });
  }
}