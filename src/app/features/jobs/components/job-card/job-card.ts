import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { JobPost } from '../../services/job.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [],
  templateUrl: './job-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCard {
  // Recibe cada objeto de empleo desde JobFeed
  job = input.required<JobPost>();

  // Obtiene el nombre del oficio de forma segura desde la relación de NestJS o del valor directo
  oficioNombre = computed(() => {
    const j = this.job() as any;
    return j.oficio?.nombre || j.oficioNombre || 'Servicio';
  });

  // Extrae y formatea el teléfono del cuerpo de la descripción
  whatsappUrl = computed(() => {
    const currentJob = this.job();
    const description = currentJob.descripcion || '';

    // Busca secuencias numéricas de 10 a 12 dígitos en la descripción
    const phoneMatches = description.match(/\d{10,12}/);
    const rawPhone = phoneMatches ? phoneMatches[0] : '';

    if (!rawPhone) return null;

    // Aplica el prefijo internacional de México (521) si el número es de 10 dígitos
    const formattedPhone = rawPhone.length === 10 ? `521${rawPhone}` : rawPhone;

    const message = encodeURIComponent(
      `Hola, vi tu publicación "${currentJob.titulo}" en la plataforma y me interesa más información.`
    );

    return `https://wa.me/${formattedPhone}?text=${message}`;
  });

  /**
   * Abre la ventana de WhatsApp Web/App al hacer clic en el botón de contacto
   */
  contactWhatsApp(): void {
    const url = this.whatsappUrl();

    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Esta publicación no incluye un número de contacto válido en la descripción.');
    }
  }
}