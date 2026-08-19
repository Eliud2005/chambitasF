import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

    const val = this.form.value;

    // 1. DTO exacto para NestJS (POST /auth/register)
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

    // 2. Registro local previo/fallback para alimentar las Signals y localStorage
    this.professionalService.registerLocalProfessional({
      nombre: val.nombre,
      apellido: val.apellido,
      email: val.email,
      telefono: val.telefono,
      zonaCobertura: val.zonaCobertura,
      experiencia: val.experiencia,
      descripcion: val.descripcion,
    });

    // 3. Petición a la API de NestJS
    this.authService.register(registerData).subscribe({
      next: () => {
        // Recargar desde el servidor si la API respondió correctamente
        this.professionalService.loadProfessionals();
        this.formSubmitted.emit();
        this.router.navigate(['/profesional-feed']);
      },
      error: (err) => {
        console.warn(
          'Servidor no disponible o falló la API. Los datos se conservarán localmente:',
          err
        );
        // Aun si falla el backend en local, redirige y emite evento con la data guardada en localStorage
        this.formSubmitted.emit();
        this.router.navigate(['/profesional-feed']);
      },
    });
  }
}