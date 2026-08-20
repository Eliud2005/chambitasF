import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Oficio {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm!: FormGroup;
  isTrabajador = false;

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
    this.loadFromLocalStorage();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Campo Contraseña agregado
      zonaCobertura: [''],
      descripcion: [''],
      experiencia: [''],
      disponible: [true]
    });
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('user');
    if (savedData) {
      const user = JSON.parse(savedData);

      this.isTrabajador = user.rol === 'TRABAJADOR';

      this.profileForm.patchValue({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: user.password || '', // Cargar contraseña guardada
        zonaCobertura: user.zonaCobertura || '',
        descripcion: user.descripcion || '',
        experiencia: user.experiencia || '',
        disponible: user.disponible !== undefined ? user.disponible : true
      });

      if (user.oficios && Array.isArray(user.oficios)) {
        this.selectedOficios = user.oficios;
      }
    }
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
      const currentStorage = JSON.parse(localStorage.getItem('user') || '{}');

      const updatedUser = {
        ...currentStorage,
        ...this.profileForm.value,
        oficios: this.isTrabajador ? this.selectedOficios : undefined
      };

      // 1. Guardar la información en la sesión del usuario actual
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 2. Redirección y lógica según el Rol
      if (this.isTrabajador) {
        const workersList: any[] = JSON.parse(localStorage.getItem('workers_list') || '[]');

        const index = workersList.findIndex(
          (w: any) => (updatedUser.id && w.id === updatedUser.id) || w.email === currentStorage.email || w.email === updatedUser.email
        );

        if (index !== -1) {
          workersList[index] = { ...workersList[index], ...updatedUser };
        } else {
          workersList.push(updatedUser);
        }

        localStorage.setItem('workers_list', JSON.stringify(workersList));

        alert('Perfil de Trabajador actualizado con éxito.');
        this.router.navigate(['/trabajadores']);
      } else {
        alert('Perfil de Cliente actualizado con éxito.');
        this.router.navigate(['/trabajos']);
      }
    }
  }

  saveOficios(): void {
    this.saveProfile();
  }
}
