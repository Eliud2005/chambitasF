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

  // Readonly Signals expuestas desde el servicio para el HTML
  professionals = this.professionalService.professionals;
  oficios = this.professionalService.oficios;
  isLoading = this.professionalService.isLoading;

  // Filtros vinculados
  selectedZona = signal<string>('');
  selectedOficioId = signal<string>('');
  onlyAvailable = signal<boolean>(true);

  // Lista de municipios para el filtro de zona
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca'
  ];

  ngOnInit(): void {
    // Carga catálogo de oficios y lista filtrada de profesionales desde la base de datos
    this.professionalService.loadOficios();
    this.fetchProfessionals();
  }

  /**
   * Consulta el backend con los parámetros actuales
   */
  fetchProfessionals(): void {
    this.professionalService.loadProfessionals({
      zona: this.selectedZona() || undefined,
      oficioId: this.selectedOficioId() || undefined,
      disponible: this.onlyAvailable() ? true : undefined
    });
  }

  /**
   * Manejador de eventos al cambiar selectores o checkbox en la plantilla
   */
  onFilterChange(): void {
    this.fetchProfessionals();
  }
}