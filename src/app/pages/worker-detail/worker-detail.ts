import { Component, OnInit, inject} from '@angular/core';
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
  imports: [RouterLink],
  templateUrl: './worker-detail.html',
 
})
export class WorkerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  workerId: string | null = null;

  // Simulación de datos públicos consumidos desde GET /trabajadores/:id
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
    // Obtener el ID del trabajador desde la URL (/trabajadores/:id)
    this.workerId = this.route.snapshot.paramMap.get('id');
  }

  // Genera el enlace directo a WhatsApp (sin chat interno)
  getWhatsAppLink(): string {
    const message = encodeURIComponent(`Hola ${this.worker.nombre}, vi tu perfil en la plataforma y me interesa consultar por tus servicios.`);
    return `https://wa.me/52${this.worker.telefono}?text=${message}`;
  }

}
