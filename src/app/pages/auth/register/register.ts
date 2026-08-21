import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
registerForm: FormGroup;
constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CLIENT', Validators.required],
      trade: [''],
      location: ['']
    });
  }


  isWorker(): boolean {
    return this.registerForm.get('role')?.value === 'WORKER';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Registro enviado:', this.registerForm.value);
      // Próximamente se enviarán estos datos al backend
    }
  }
}
