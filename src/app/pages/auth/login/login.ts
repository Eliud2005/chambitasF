import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Propiedades requeridas para la interfaz
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
    const { email, password } = this.loginForm.value;

    const registeredUsers = JSON.parse(localStorage.getItem('users_db') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Iniciar sesión guardando la sesión activa
      localStorage.setItem('user', JSON.stringify(user));
      
      this.isLoading = false;
      alert(`¡Bienvenido de nuevo, ${user.nombre}!`);
      
      // Redirigir al feed de empleos
      this.router.navigate(['/jobs']);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}