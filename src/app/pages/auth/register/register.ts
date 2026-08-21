import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CLIENT', Validators.required],
    trade: [''],
    location: ['']
  });

  isWorker(): boolean {
    return this.registerForm.get('role')?.value === 'WORKER';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Registro enviado:', this.registerForm.value);
      
      // Aquí puedes simular o guardar de forma local si lo necesitan por ahora, 
      // y mandarlo directo al login para que pruebe sus credenciales:
      this.router.navigate(['/login']);
    }
  }
}