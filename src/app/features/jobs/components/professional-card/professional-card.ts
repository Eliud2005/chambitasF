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

  whatsappUrl = computed(() => {
    const p = this.professional();
    const cleanPhone = p.phone.startsWith('521') ? p.phone : `521${p.phone.replace(/\D/g, '')}`;
    const text = encodeURIComponent(
      `Hola ${p.name}, vi tu perfil en la plataforma y me gustaría solicitar información sobre tus servicios de ${p.category}.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  });
}