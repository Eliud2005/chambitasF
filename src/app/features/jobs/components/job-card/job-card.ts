import { Component, input } from '@angular/core';
import { JobPost } from '../../models/job.model'; // Ajusta la ruta a tu modelo

@Component({
  selector: 'app-job-card',
  imports: [],
  templateUrl: './job-card.html',
})
export class JobCard {
  // Recibe cada objeto de empleo desde el JobFeed
  job = input.required<JobPost>();

  // Función para redirigir a WhatsApp
  contactWhatsApp() {
    const phone = this.job().contactPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hola, vi tu anuncio "${this.job().title}" en la plataforma y me interesa.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }
}