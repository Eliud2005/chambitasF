import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ProfessionalCard } from '../professional-card/professional-card';
import { ProfessionalService } from '../../services/professional.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-professional-feed',
  standalone: true,
  imports: [ProfessionalCard, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './professional-feed.html',
  host: {
    class: 'block'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalFeed implements OnInit {
  private professionalService = inject(ProfessionalService);

  // Signals consumidos por el HTML
  professionals = this.professionalService.professionals;
  oficios = this.professionalService.oficios; // <-- CORREGIDO: Exposición del Signal de oficios

  // Filtros locales
  selectedZona = signal<string>('');
  selectedOficioId = signal<string>('');
  onlyAvailable = signal<boolean>(true);

  // Lista de zonas para el selector
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca'
  ];

  ngOnInit(): void {
    // CORREGIDO: Cargar el catálogo de oficios al iniciar
    this.professionalService.loadOficios();
    
    // Carga inicial de trabajadores desde la API
    this.fetchProfessionals();
  }

  fetchProfessionals(): void {
    this.professionalService.loadProfessionals({
      zona: this.selectedZona() || undefined,
      oficioId: this.selectedOficioId() || undefined,
      disponible: this.onlyAvailable() ? true : undefined
    });
  }

  onFilterChange(): void {
    this.fetchProfessionals();
  }
}