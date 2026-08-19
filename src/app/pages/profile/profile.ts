import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Oficio {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
 
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  isTrabajador = true;


  availableOficios: Oficio[] = [
    { id: '1', nombre: 'Plomería' },
    { id: '2', nombre: 'Electricidad' },
    { id: '3', nombre: 'Carpintería' },
    { id: '4', nombre: 'Pintura' },
    { id: '5', nombre: 'Jardinería' },
    { id: '6', nombre: 'Albañilería' }
  ];


  selectedOficios: string[] = ['1', '2'];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['Dhayan', [Validators.required]],
      apellido: ['carlos', [Validators.required]],
      email: ['dhayan@carlos.com', [Validators.required, Validators.email]],
      telefono: ['4441234567', [Validators.required]],
      zonaCobertura: ['oaxaca - Centro'],
      descripcion: ['Especialista en mantenimiento e instalaciones eléctricas.'],
      experiencia: ['Más de 5 años de experiencia en el sector.'],
      disponible: [true]
    });
  }


  toggleOficio(id: string): void {
    const index = this.selectedOficios.indexOf(id);
    if (index > -1) {
      this.selectedOficios.splice(index, 1);
    } else {
      if (this.selectedOficios.length < 3) {
        this.selectedOficios.push(id);
      } else {
        alert('Solo puedes seleccionar un máximo de 3 oficios principales.');
      }
    }
  }


  isSelected(id: string): boolean {
    return this.selectedOficios.includes(id);
  }


  saveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Perfil guardado:', this.profileForm.value);
      alert('Perfil actualizado con éxito');
    }
  }


  saveOficios(): void {
    console.log('Oficios guardados (IDs):', this.selectedOficios);
    alert('Oficios actualizados con éxito');
  }
}
