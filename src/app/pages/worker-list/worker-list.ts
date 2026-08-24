import { Component, OnInit, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './worker-list.html',
})
export class WorkerListComponent implements OnInit {
  workers = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  // URL con el prefijo /api/v1 correcto
  private readonly API_URL = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWorkers();
  }

  fetchWorkers(): void {
    this.isLoading.set(true);

    const params = new HttpParams().set('rol', 'TRABAJADOR');

    this.http.get<any>(this.API_URL, { params }).subscribe({
      next: (response) => {
        // TransformInterceptor suele envolver la respuesta en { statusCode, data: [...] } o devolver el array directo
        const rawList = Array.isArray(response) 
          ? response 
          : (Array.isArray(response?.data) ? response.data : []);

        const mappedWorkers = rawList.map((w: any) => {
          let oficiosNombres: string[] = [];

          if (w.perfilTrabajador?.oficios?.length) {
            oficiosNombres = w.perfilTrabajador.oficios.map(
              (item: any) => item.oficio?.nombre || item.nombre || item
            ).filter(Boolean);
          }

          return {
            id: w.id,
            perfilTrabajadorId: w.perfilTrabajador?.id,
            nombre: w.nombre || '',
            apellido: w.apellido || '',
            nombreCompleto: `${w.nombre || ''} ${w.apellido || ''}`.trim() || 'Trabajador Independiente',
            descripcion: w.perfilTrabajador?.descripcion || 'Sin descripción disponible',
            zonaCobertura: w.perfilTrabajador?.zonaCobertura || 'Ocotlán de Morelos',
            disponible: w.perfilTrabajador?.disponible ?? true,
            telefono: w.telefono || w.perfilTrabajador?.telefono,
            oficios: oficiosNombres
          };
        });

        this.workers.set(mappedWorkers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar trabajadores:', err);
        this.isLoading.set(false);
      }
    });
  }
}