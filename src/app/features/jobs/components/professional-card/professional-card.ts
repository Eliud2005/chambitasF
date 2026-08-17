import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProfessionalProfile } from '../../models/professional.model';

@Component({
  selector: 'app-professional-card',
  standalone: true,
  imports: [],
  templateUrl: './professional-card.html',
  host: {
    class: 'block h-full'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalCard {
  professional = input.required<ProfessionalProfile>();

  // Obtiene el oficio principal o el primero de la lista
  primaryOficio = computed(() => {
    const p = this.professional();
    const principal = p.oficios?.find((o) => o.principal)?.oficio.nombre;
    return principal || p.oficios?.[0]?.oficio.nombre || 'Servicios Generales';
  });

  // Genera el enlace de WhatsApp formateando el teléfono de México (521)
  whatsappUrl = computed(() => {
    const p = this.professional();
    const oficio = this.primaryOficio();
    const cleanDigits = (p.telefono || '').replace(/\D/g, '');
    
    // Antepone lada nacional 521 si el número tiene 10 dígitos
    const fullPhone = cleanDigits.length === 10 ? `521${cleanDigits}` : cleanDigits;
    
    const text = encodeURIComponent(
      `Hola ${p.nombre}, vi tu perfil en la plataforma y me gustaría solicitar información sobre tus servicios de ${oficio}.`
    );
    return `https://wa.me/${fullPhone}?text=${text}`;
  });
}