import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfessionalService } from '../../services/professional.service';

@Component({
  selector: 'app-job-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './job-filter.html',
})
export class JobFilter implements OnInit {
  private professionalService = inject(ProfessionalService);

  // Outputs tipo Signal (Angular 17.3+)
  searchQuery = output<string>();
  categoryChange = output<string>();
  locationChange = output<string>();

  // Catálogo dinámico de oficios desde NestJS / MariaDB
  oficios = this.professionalService.oficios;

  // Municipios / Zonas de cobertura
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca',
    'Reforma',
    'Xochimilco',
    'Santa Cruz Xoxocotlán',
  ];

  selectedCategory = signal<string>(''); // Vacío = Todos los oficios
  selectedLocation = signal<string>(''); // Vacío = Todas las zonas

  ngOnInit(): void {
    // Carga el catálogo de oficios directamente desde el backend si aún no está en memoria
    if (this.oficios().length === 0) {
      this.professionalService.loadOficios();
    }
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.emit(value.trim());
  }

  selectCategory(oficioId: string): void {
    const newCategory = this.selectedCategory() === oficioId ? '' : oficioId;
    this.selectedCategory.set(newCategory);
    this.categoryChange.emit(newCategory);
  }

  onLocationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLocation.set(value);
    this.locationChange.emit(value);
  }

  resetFilters(): void {
    this.selectedCategory.set('');
    this.selectedLocation.set('');
    this.categoryChange.emit('');
    this.locationChange.emit('');
    this.searchQuery.emit('');
  }
}