import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessionalService } from '../../services/professional.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-professional-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './professional-form.html',
})
export class ProfessionalForm {
  private fb = inject(FormBuilder);
  private professionalService = inject(ProfessionalService);

  // Evento opcional para notificar al padre cuando el registro fue exitoso (ej. para cerrar un modal)
  formSubmitted = output<void>();

  // Categorías de oficios locales predefinidas
  categories: string[] = [
    'Plomería',
    'Electricidad',
    'Carpintería',
    'Pintura',
    'Mecanica',
    'Albañilería',
    'Herrería',
    'Jardinería',
    'Limpieza',
    'Otro'
  ];

  // Municipios y zonas principales
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca',
    'Otra zona'
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    location: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
    yearsOfExperience: [1, [Validators.required, Validators.min(0), Validators.max(60)]],
    description: ['', [Validators.required, Validators.minLength(15)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;

    // Guardar el nuevo perfil profesional en el servicio
    this.professionalService.addProfessional({
      name: formValues.name,
      category: formValues.category,
      location: formValues.location,
      phone: formValues.phone.startsWith('521') ? formValues.phone : `521${formValues.phone}`,
      yearsOfExperience: formValues.yearsOfExperience,
      description: formValues.description,
      isVerified: false,
    });

    this.form.reset({ yearsOfExperience: 1 });
    this.formSubmitted.emit();
  }
}