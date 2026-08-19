import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Role } from '../../core/models/auth.interface';

interface Oficio {
  id: string;
  nombre: string;
  categoria: string;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  isEditing = false;
  userRole: Role = 'TRABAJADOR';

  // Catálogo simulado de oficios (proviene de GET /oficios)
  catalogoOficios: Oficio[] = [
    { id: '1', nombre: 'Plomería', categoria: 'Mantenimiento' },
    { id: '2', nombre: 'Electricidad', categoria: 'Mantenimiento' },
    { id: '3', nombre: 'Albañilería', categoria: 'Construcción' },
    { id: '4', nombre: 'Pintura', categoria: 'Acabados' },
    { id: '5', nombre: 'Carpintería', categoria: 'Construcción' },
    { id: '6', nombre: 'Jardinería', categoria: 'Exteriores' }
  ];

  // IDs de oficios seleccionados (Máximo 3 según RN-03)[cite: 1]
  selectedOficiosIds: string[] = ['1', '2'];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre: [{ value: 'Dhayan', disabled: true }, [Validators.required]],
      apellido: [{ value: 'Martínez', disabled: true }, [Validators.required]],
      email: [{ value: 'dhayan@ejemplo.com', disabled: true }, [Validators.required, Validators.email]],
      telefono: [{ value: '4441234567', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      zonaCobertura: [{ value: 'San Luis Potosí - Zona Centro', disabled: true }],
      descripcion: [{ value: 'Especialista en mantenimiento e instalaciones eléctricas residenciales.', disabled: true }],
      experiencia: [{ value: '5 años de experiencia en trabajos independientes.', disabled: true }],
      disponible: [{ value: true, disabled: true }]
    });
  }

  // Manejo de Checkboxes de Oficios (Regla RN-03: Max 3)[cite: 1]
  toggleOficio(oficioId: string): void {
    if (!this.isEditing) return;

    const index = this.selectedOficiosIds.indexOf(oficioId);
    if (index > -1) {
      this.selectedOficiosIds.splice(index, 1);
    } else {
      if (this.selectedOficiosIds.length < 3) {
        this.selectedOficiosIds.push(oficioId);
      } else {
        alert('Solo puedes seleccionar un máximo de 3 oficios principales.');
      }
    }
  }

  isOficioSelected(oficioId: string): boolean {
    return this.selectedOficiosIds.includes(oficioId);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedData = {
        ...this.profileForm.getRawValue(),
        oficiosPrincipales: this.selectedOficiosIds // Para PUT /trabajadores/me/oficios[cite: 1]
      };
      console.log('Datos listos para sincronizar con el Backend:', updatedData);
      this.toggleEdit();
    }
  }
}
