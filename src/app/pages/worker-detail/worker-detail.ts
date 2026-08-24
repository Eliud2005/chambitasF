import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface WorkerPublicProfile {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  zonaCobertura: string;
  descripcion: string;
  experiencia: string;
  disponible: boolean;
  oficios: string[];
}

@Component({
  selector: 'app-worker-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './worker-detail.html',
})
export class WorkerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/usuarios'; // Endpoint de tu backend

  workerId: string | null = null;
  isLoading = true;
  errorMessage = '';

  // Objeto con estructura inicial limpia
  worker: WorkerPublicProfile = {
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
    zonaCobertura: '',
    descripcion: '',
    experiencia: '',
    disponible: true,
    oficios: []
  };

  ngOnInit(): void {
    // 1. Capturar el ID de la URL (/trabajadores/:id)
    this.workerId = this.route.snapshot.paramMap.get('id');

    if (this.workerId) {
      this.loadWorkerFromApi(this.workerId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se especificó un trabajador válido.';
    }
  }

  /**
   * Consulta el usuario/trabajador por ID directamente a la Base de Datos
   */
  private loadWorkerFromApi(id: string): void {
    this.isLoading = true;

    this.http.get<any>(`${this.API_URL}/${id}`).subscribe({
      next: (data) => {
        this.isLoading = false;

        // Mapa de oficios para transformar IDs numéricos/cadena en nombres legibles si el backend los regresa como IDs
        const oficiosMap: { [key: string]: string } = {
          '1': 'Plomería',
          '2': 'Electricidad',
          '3': 'Carpintería',
          '4': 'Pintura',
          '5': 'Jardinería',
          '6': 'Albañilería'
        };

        const oficiosFormateados = Array.isArray(data.oficios)
          ? data.oficios.map((oficio: any) => 
              typeof oficio === 'string' && oficiosMap[oficio] ? oficiosMap[oficio] : (oficio.nombre || oficio)
            )
          : [];

        this.worker = {
          id: data.id || id,
          nombre: data.nombre || 'Trabajador',
          apellido: data.apellido || '',
          telefono: data.telefono || '',
          zonaCobertura: data.zonaCobertura || 'Sin ubicación especificada',
          descripcion: data.descripcion || 'Sin descripción disponible.',
          experiencia: data.experiencia || 'Sin experiencia registrada.',
          disponible: data.disponible !== undefined ? data.disponible : true,
          oficios: oficiosFormateados
        };
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo cargar la información del trabajador desde la base de datos.';
      }
    });
  }

  // Genera el enlace directo a WhatsApp con el teléfono real guardado en la BD
  getWhatsAppLink(): string {
    if (!this.worker.telefono) return '#';
    const message = encodeURIComponent(`Hola ${this.worker.nombre}, vi tu perfil en la plataforma y me interesa consultar por tus servicios.`);
    return `https://wa.me/52${this.worker.telefono}?text=${message}`;
  }
}