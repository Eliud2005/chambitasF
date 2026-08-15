import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JobService } from '../../services/job.service'; // Ajusta la ruta a tu servicio
import { JobPost } from '../../models/job.model'; // Ajusta la ruta a tu modelo

@Component({
  selector: 'app-job-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,RouterLinkActive],
  templateUrl: './job-create-form.html',
})
export class JobCreateForm {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  categories: string[] = [
    'Plomería',
    'Pintura',
    'Electricidad',
    'Carpintería',
    'Limpieza',
    'Jardinería',
    'Construcción',
    'Mecanica',
  ];

  locations: string[] = [
    'Ocotlán de Morelos',
    'Centro',
    'San Felipe del Agua',
    'Santa Cruz Xoxocotlán',
    'Reforma',
    'Xochimilco',
    'Santa Lucía del Camino',
    'Zaachila',
    'Etla',
  ];

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    category: ['', [Validators.required]],
    location: ['', [Validators.required]],
    budget: [null, [Validators.min(0)]],
    contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
    description: ['', [Validators.required, Validators.minLength(15)]],
  });

  onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Extraemos los valores del formulario
  const { title, category, location, budget, contactPhone, description } = this.form.value;

  // Creamos el objeto asegurando que no viajen valores 'null'
  this.jobService.addJob({
    title: title || '',
    category: category || '',
    location: location || '',
    budget: budget ? Number(budget) : undefined,
    contactPhone: contactPhone?.startsWith('521') 
      ? contactPhone 
      : `521${contactPhone || ''}`,
    description: description || '',
  });

  this.router.navigate(['/']);
}
}