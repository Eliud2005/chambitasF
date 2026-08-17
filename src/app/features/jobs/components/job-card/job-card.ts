import { Component, input } from '@angular/core';
import { JobPost } from '../../services/job.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [],
  templateUrl: './job-card.html',
})
export class JobCard {
  // Recibe cada objeto de empleo desde JobFeed
  job = input.required<JobPost>();

  /**
   * Genera el enlace directo a WhatsApp extrayendo el número
   * de la descripción o usando una expresión regular para dígitos.
   */
  contactWhatsApp(): void {
    const currentJob = this.job();
    
    // Extrae los dígitos del teléfono incluidos en la descripción o usa un respaldo
    const phoneMatches = currentJob.descripcion.match(/\d{10,12}/);
    const rawPhone = phoneMatches ? phoneMatches[0] : '';
    
    // Si no incluye prefijo de país (521 o 52), se le antepone el de México (521)
    const formattedPhone = rawPhone.startsWith('52') ? rawPhone : `521${rawPhone}`;

    const message = encodeURIComponent(
      `Hola, vi tu publicación "${currentJob.titulo}" en la plataforma y me interesa más información.`
    );

    if (rawPhone) {
      window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
    } else {
      alert('No se encontró un número de contacto directo para esta publicación.');
    }
  }
}