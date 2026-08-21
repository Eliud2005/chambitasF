import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // 1. Obtener usuario previamente registrado (o del listado de usuarios)
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Si existe el usuario registrado y coincide el correo (o si usas simulación de backend)
      if (savedUser.email === email) {
        // Actualizamos la sesión de inicio
        localStorage.setItem('user', JSON.stringify(savedUser));

        alert('¡Inicio de sesión exitoso!');

        // 2. Redirección condicional según el ROL
        if (savedUser.rol === 'CLIENTE') {
          this.router.navigate(['/trabajos']); // El Cliente va a Buscar Trabajos
        } else {
          this.router.navigate(['/trabajadores']); // El Trabajador va al Directorio
        }
      } else {
        // Caso de respaldo si ingresas datos directos sin haber registrado previo
        const dummyUser = { email, rol: 'CLIENTE' };
        localStorage.setItem('user', JSON.stringify(dummyUser));

        alert('Inicio de sesión realizado');
        this.router.navigate(['/trabajos']);
      }
    }
  }
}
