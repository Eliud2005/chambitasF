import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JobService, CreateJobDto } from '../../services/job.service';

export interface OficioOption {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-job-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './job-create-form.html',
})
export class JobCreateForm {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  // Mapeo de oficios con sus identificadores
  categories: OficioOption[] = [
    { id: 'plomeria', nombre: 'Plomería' },
    { id: 'pintura', nombre: 'Pintura' },
    { id: 'electricidad', nombre: 'Electricidad' },
    { id: 'carpinteria', nombre: 'Carpintería' },
    { id: 'limpieza', nombre: 'Limpieza' },
    { id: 'jardineria', nombre: 'Jardinería' },
    { id: 'construccion', nombre: 'Construcción' },
    { id: 'mecanica', nombre: 'Mecánica' },
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
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    oficioId: ['', [Validators.required]],
    ubicacion: ['', [Validators.required]],
    presupuesto: [null, [Validators.min(0)]],
    telefonoContacto: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { titulo, oficioId, ubicacion, presupuesto, telefonoContacto, descripcion } = this.form.value;

    const phoneFormatted = telefonoContacto?.startsWith('521')
      ? telefonoContacto
      : `521${telefonoContacto || ''}`;

    // Buscar el nombre del oficio para mostrarlo en las tarjetas
    const oficioSeleccionado = this.categories.find((cat) => cat.id === oficioId);

    const dto: CreateJobDto = {
      titulo: titulo || '',
      oficioId: oficioId || '',
      ubicacion: ubicacion || '',
      presupuesto: presupuesto ? Number(presupuesto) : undefined,
      descripcion: `${descripcion || ''}\n\nContacto: ${phoneFormatted}`,
    };

    this.jobService.addJob(dto, oficioSeleccionado?.nombre);
    this.router.navigate(['/']);
  }
}