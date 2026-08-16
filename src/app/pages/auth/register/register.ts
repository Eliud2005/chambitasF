import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    rol: ['CLIENTE', [Validators.required]],
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
      console.log('Datos listos para enviar al Backend NestJS:', formData);
      // Aquí nos conectaremos con el servicio HTTP cuando el backend esté desplegado
    }
  }
}
