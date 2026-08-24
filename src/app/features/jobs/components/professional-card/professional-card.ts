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

  // Obtiene el nombre del trabajador (soporta estructura directa o anidada en 'usuario')
  fullName = computed(() => {
    const p = this.professional() as any;
    const nombre = p.nombre || p.usuario?.nombre || 'Profesional';
    const apellido = p.apellido || p.usuario?.apellido || '';
    return `${nombre} ${apellido}`.trim();
  });

  // Obtiene el número de teléfono (soporta estructura directa o anidada en 'usuario')
  phone = computed(() => {
    const p = this.professional() as any;
    return p.telefono || p.usuario?.telefono || '';
  });

  // Obtiene el oficio principal de forma segura
  primaryOficio = computed(() => {
    const p = this.professional() as any;
    if (!p.oficios || p.oficios.length === 0) return 'Servicios Generales';

    const firstItem = p.oficios[0];
    
    // Soporta ambas relaciones de TypeORM: [{ oficio: { nombre: '...' } }] o [{ nombre: '...' }]
    return firstItem?.oficio?.nombre || firstItem?.nombre || 'Servicios Generales';
  });

  // Genera el enlace directo a WhatsApp
  whatsappUrl = computed(() => {
    const rawPhone = this.phone();
    const name = this.fullName();
    const oficio = this.primaryOficio();

    const cleanDigits = rawPhone.replace(/\D/g, '');
    
    // Si el número tiene 10 dígitos (formato MX), se antepone la clave de país (521)
    const fullPhone = cleanDigits.length === 10 ? `521${cleanDigits}` : cleanDigits;

    const message = encodeURIComponent(
      `Hola ${name}, vi tu perfil en la plataforma y me gustaría solicitar información sobre tus servicios de ${oficio}.`
    );

    return `https://wa.me/${fullPhone}?text=${message}`;
  });
}