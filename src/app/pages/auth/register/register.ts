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

      const newUser = {
        id: Date.now().toString(),
        ...formData,
        oficios: this.isWorker() ? [] : undefined,
        disponible: this.isWorker() ? true : undefined
      };

      // Guardar en la base de datos de usuarios registrados
      const registeredUsers = JSON.parse(localStorage.getItem('users_db') || '[]');
      
      // Validar si el email ya existe
      if (registeredUsers.some((u: any) => u.email === formData.email)) {
        alert('Este correo ya está registrado.');
        return;
      }

      registeredUsers.push(newUser);
      localStorage.setItem('users_db', JSON.stringify(registeredUsers));

      // Si es trabajador, se añade también al directorio público
      if (this.isWorker()) {
        const existingWorkers = JSON.parse(localStorage.getItem('workers_list') || '[]');
        existingWorkers.push(newUser);
        localStorage.setItem('workers_list', JSON.stringify(existingWorkers));
      }

      alert('¡Registro exitoso! Por favor inicia sesión.');
      // Redirigir al login tras el registro exitoso
      this.router.navigate(['/login']);
    }
  }
}