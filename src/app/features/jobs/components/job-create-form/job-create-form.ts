import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JobService, CreateJobDto, Oficio } from '../../services/job.service';

@Component({
  selector: 'app-job-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './job-create-form.html',
})
export class JobCreateForm implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Signal con tipado estricto para la lista de oficios
  oficios = signal<Oficio[]>([]);

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
    telefonoContacto: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]],
  });

  ngOnInit(): void {
    this.getOficios();
  }

  getOficios(): void {
    this.jobService.getOficios().subscribe({
      // ✅ Se declaran explícitamente los tipos para evitar el error TS7006
      next: (data: Oficio[]) => this.oficios.set(data),
      error: (err: any) => console.error('Error al cargar la lista de oficios:', err),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { titulo, oficioId, ubicacion, presupuesto, telefonoContacto, descripcion } = this.form.value;

    const cleanPhone = telefonoContacto?.trim() || '';
    const phoneFormatted = cleanPhone.startsWith('521')
      ? cleanPhone
      : `521${cleanPhone}`;

    const dto: CreateJobDto = {
      titulo: titulo || '',
      oficioId: oficioId || '',
      ubicacion: ubicacion || '',
      presupuesto: presupuesto ? Number(presupuesto) : undefined,
      descripcion: `${descripcion || ''}\n\nContacto: ${phoneFormatted}`,
    };

    this.jobService.addJob(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error('Error al guardar la publicación en la BD:', err);
        this.errorMessage.set(
          err?.error?.message || 'Ocurrió un error al intentar crear la publicación.'
        );
      },
    });
  }
}