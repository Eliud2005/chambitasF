import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    rol: ['TRABAJADOR', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    zonaCobertura: [''],
    descripcion: ['']
  });

  isWorker(): boolean {
    return this.registerForm.get('rol')?.value === 'TRABAJADOR';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // 1. Guardar la sesión activa del usuario
      const currentUser = {
        id: Date.now().toString(),
        ...formData,
        oficios: this.isWorker() ? [] : undefined, // Los clientes NO tienen oficios
        disponible: this.isWorker() ? true : undefined
      };

      localStorage.setItem('user', JSON.stringify(currentUser));

      // 2. SOLO si es TRABAJADOR, se agrega al directorio público
      if (this.isWorker()) {
        const existingWorkers = JSON.parse(localStorage.getItem('workers_list') || '[]');
        existingWorkers.push(currentUser);
        localStorage.setItem('workers_list', JSON.stringify(existingWorkers));

        alert('¡Registro exitoso como Trabajador!');
        // Si es trabajador, lo mandamos al directorio o a configurar su perfil
        this.router.navigate(['/trabajadores']);
      } else {
        alert('¡Registro exitoso como Cliente!');
        // Si es cliente, no va al directorio de trabajadores
        this.router.navigate(['/profile']);
      }
    }
  }
}
