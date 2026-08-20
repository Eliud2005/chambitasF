import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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

  workerId: string | null = null;

  // Datos por defecto si el LocalStorage está vacío
  worker: WorkerPublicProfile = {
    id: 'w123',
    nombre: 'Dhayan',
    apellido: 'Martínez',
    telefono: '4441234567',
    zonaCobertura: 'San Luis Potosí - Zona Centro',
    descripcion: 'Especialista en mantenimiento e instalaciones eléctricas residenciales y comerciales.',
    experiencia: 'Más de 5 años realizando trabajos independientes con excelente reputación.',
    disponible: true,
    oficios: ['Electricidad', 'Plomería']
  };

  ngOnInit(): void {
    // 1. Capturar el ID de la URL (/trabajadores/:id)
    this.workerId = this.route.snapshot.paramMap.get('id');

    // 2. Leer del LocalStorage
    this.loadWorkerFromLocalStorage();
  }

  private loadWorkerFromLocalStorage(): void {
    const savedData = localStorage.getItem('user');
    if (savedData) {
      const user = JSON.parse(savedData);

      // Mapeo dinámico de IDs de oficios a nombres visibles
      const oficiosMap: { [key: string]: string } = {
        '1': 'Plomería',
        '2': 'Electricidad',
        '3': 'Carpintería',
        '4': 'Pintura',
        '5': 'Jardinería',
        '6': 'Albañilería'
      };

      // Si vienen IDs de oficios (ej. ['1', '2']), los convierte a texto legible (ej. ['Plomería', 'Electricidad'])
      const oficiosNombres = user.oficios
        ? user.oficios.map((id: string) => oficiosMap[id] || id)
        : this.worker.oficios;

      this.worker = {
        id: this.workerId || 'w123',
        nombre: user.nombre || user.fullName || this.worker.nombre,
        apellido: user.apellido || this.worker.apellido,
        telefono: user.telefono || user.phone || this.worker.telefono,
        zonaCobertura: user.zonaCobertura || user.location || this.worker.zonaCobertura,
        descripcion: user.descripcion || user.bio || this.worker.descripcion,
        experiencia: user.experiencia || this.worker.experiencia,
        disponible: user.disponible !== undefined ? user.disponible : true,
        oficios: oficiosNombres
      };
    }
  }

  // Genera el enlace directo a WhatsApp
  getWhatsAppLink(): string {
    const message = encodeURIComponent(`Hola ${this.worker.nombre}, vi tu perfil en la plataforma y me interesa consultar por tus servicios.`);
    return `https://wa.me/52${this.worker.telefono}?text=${message}`;
  }
}
