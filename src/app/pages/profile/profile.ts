import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

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
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  private readonly API_USERS_URL = 'http://localhost:3000/api/v1/users';
  private readonly API_OFICIOS_URL = 'http://localhost:3000/api/v1/oficios';

  profileForm!: FormGroup;
  isTrabajador = false;
  isLoading = false;

  showToast = false;
  toastMessage = '';
  avatarPreview: string | null = null;
  private selectedFile: File | null = null;

  availableOficios: Oficio[] = [];
  selectedOficios: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadAvailableOficios();
    this.loadUserDataFromApi();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      password: [''],
      zonaCobertura: [''],
      descripcion: [''],
      experiencia: [''],
      disponible: [true]
    });
  }

  private getAuthToken(): string | null {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('auth_token')
    );
  }

  private getFullAvatarUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:image')) {
      return path;
    }
    return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Carga el catálogo real de oficios con sus UUIDs desde la base de datos
   */
  private loadAvailableOficios(): void {
    this.http.get<any>(this.API_OFICIOS_URL).subscribe({
      next: (response) => {
        const data = response?.data || response;
        if (Array.isArray(data)) {
          this.availableOficios = data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al cargar el catálogo de oficios:', err);
      }
    });
  }

  private loadUserDataFromApi(): void {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    this.http.get(`${this.API_USERS_URL}/me`, { headers }).subscribe({
      next: (response: any) => {
        const user = response?.data || response;

        if (!user || Object.keys(user).length === 0) {
          console.warn('El objeto de usuario llegó vacío o nulo.');
          return;
        }

        this.isTrabajador = user.rol === 'TRABAJADOR';
        
        const rawAvatar = user.avatar || user.fotoUrl || null;
        this.avatarPreview = this.getFullAvatarUrl(rawAvatar);

        const perfil = user.perfilTrabajador || {};

        if (perfil.oficios && Array.isArray(perfil.oficios)) {
          this.selectedOficios = perfil.oficios.map((item: any) => item.oficioId || item.oficio?.id).filter(Boolean);
        } else if (user.oficios && Array.isArray(user.oficios)) {
          this.selectedOficios = user.oficios.map((item: any) => item.id || item);
        }

        setTimeout(() => {
          this.profileForm.patchValue({
            nombre: user.nombre ?? '',
            apellido: user.apellido ?? '',
            email: user.email ?? '',
            telefono: user.telefono ?? '',
            zonaCobertura: perfil.zonaCobertura ?? user.zonaCobertura ?? '',
            descripcion: perfil.descripcion ?? user.descripcion ?? '',
            experiencia: perfil.experiencia ?? user.experiencia ?? '',
            disponible: perfil.disponible !== undefined ? perfil.disponible : (user.disponible ?? true)
          });

          if (user.email) {
            this.profileForm.get('email')?.setValue(user.email);
          }

          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }, 50);
      },
      error: (err) => {
        console.error('Error detallado al cargar perfil desde la API:', err);
        if (err.status === 401) {
          this.triggerToast('Sesión expirada. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const file = this.selectedFile;
      const reader = new FileReader();

      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.cdr.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  get passwordStrength(): { text: string; color: string; width: string } {
    const pwd = this.profileForm.get('password')?.value || '';
    if (pwd.length === 0) return { text: '', color: '', width: '0%' };
    if (pwd.length < 6) return { text: 'Débil', color: 'bg-red-500', width: '33%' };
    if (pwd.length < 10) return { text: 'Media', color: 'bg-yellow-500', width: '66%' };
    return { text: 'Fuerte', color: 'bg-emerald-500', width: '100%' };
  }

  private triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3500);
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
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.triggerToast('Por favor, completa correctamente todos los campos obligatorios.');
      return;
    }

    this.isLoading = true;
    const formValues = this.profileForm.getRawValue();

    const formData = new FormData();
    formData.append('nombre', formValues.nombre);
    formData.append('apellido', formValues.apellido);
    formData.append('telefono', formValues.telefono);

    if (formValues.password && formValues.password.trim() !== '') {
      formData.append('password', formValues.password);
    }

    if (this.isTrabajador) {
      if (formValues.zonaCobertura) formData.append('zonaCobertura', formValues.zonaCobertura);
      if (formValues.descripcion) formData.append('descripcion', formValues.descripcion);
      if (formValues.experiencia) formData.append('experiencia', formValues.experiencia);
      formData.append('disponible', String(formValues.disponible));
    }

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    this.http.patch(`${this.API_USERS_URL}/me`, formData, { headers }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.selectedFile = null;

        const updatedUser = response?.data || response;
        const newRawAvatar = updatedUser?.avatar || updatedUser?.fotoUrl;
        if (newRawAvatar) {
          this.avatarPreview = this.getFullAvatarUrl(newRawAvatar);
        }

        this.triggerToast('Datos y foto actualizados con éxito.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al actualizar perfil:', err?.error);
        const message = Array.isArray(err?.error?.message) 
          ? err.error.message.join(' | ') 
          : err?.error?.message || 'Error al actualizar el perfil.';
        this.triggerToast(message);
      }
    });
  }

  saveOficios(): void {
    this.isLoading = true;

    const payload = {
      oficios: this.selectedOficios
    };

    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    this.http.post(`${this.API_USERS_URL}/me/oficios`, payload, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.triggerToast('Oficios principales actualizados con éxito.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al actualizar oficios:', err?.error);
        this.triggerToast('Error al actualizar los oficios.');
      }
    });
  }
}