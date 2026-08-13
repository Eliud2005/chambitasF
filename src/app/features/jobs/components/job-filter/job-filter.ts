import { Component, signal, output } from '@angular/core';

@Component({
  selector: 'app-job-filter',
  imports: [],
  templateUrl: './job-filter.html',
})
export class JobFilter {
  searchQuery = output<string>();
  categoryChange = output<string>();
  locationChange = output<string>();

  categories: string[] = [
    'Todas',
    'Plomería',
    'Pintura',
    'Electricidad',
    'Carpintería',
    'Limpieza',
    'Jardinería',
    'Construcción',
    'Mecanica',
  ];

  locations: string[] = [
    'Todas las zonas',
    'Centro',
    'Ocotlán de Morelos',
    'San Felipe del Agua',
    'Reforma',
    'Xochimilco',
    'Santa Cruz Xoxocotlán',
    'Santa Lucía del Camino',
    'Zaachila',
    'Etla',
  ];

  selectedCategory = signal<string>('Todas');
  selectedLocation = signal<string>('Todas las zonas');

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.emit(value);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.categoryChange.emit(category);
  }

  onLocationChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLocation.set(value);
    this.locationChange.emit(value);
  }
}