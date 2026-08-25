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

  showToast = false;
  toastMessage = '';
  avatarPreview: string | null = null;


  lastLoginDate: string = '';

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
    this.lastLoginDate = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
      this.avatarPreview = user.avatar || null;

      this.profileForm.patchValue({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: user.password || '',
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
  }

  private triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }


  logout(): void {
    localStorage.removeItem('user');
    this.triggerToast('Sesión cerrada correctamente.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  toggleOficio(id: string): void {
    const index = this.selectedOficios.indexOf(id);
    if (index > -1) {
      this.selectedOficios.splice(index, 1);
    } else {
      if (this.selectedOficios.length < 3) {
        this.selectedOficios.push(id);
      } else {
        this.triggerToast('Solo puedes seleccionar un máximo de 3 oficios principales.');
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
        avatar: this.avatarPreview,
        oficios: this.isTrabajador ? this.selectedOficios : undefined
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

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

        this.triggerToast('Perfil actualizado con éxito.');
        setTimeout(() => this.router.navigate(['/trabajadores']), 1200);
      } else {
        this.triggerToast('Perfil actualizado con éxito.');
        setTimeout(() => this.router.navigate(['/trabajos']), 1200);
      }
    }
  }

  saveOficios(): void {
    this.saveProfile();
  }
}

