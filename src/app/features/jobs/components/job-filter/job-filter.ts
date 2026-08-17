import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Oficio } from '../../models/professional.model';
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

  // Catálogo dinámico de oficios desde NestJS
  oficios = this.professionalService.oficios;

  // Lista local de ubicaciones / zonas de cobertura
  locations: string[] = [
    'Ocotlán de Morelos',
    'San Antonino Castillo Velasco',
    'Ejutla de Crespo',
    'Zaachila',
    'Centro / Oaxaca',
    'Reforma',
    'Xochimilco',
    'Santa Cruz Xoxocotlán'
  ];

  selectedCategory = signal<string>(''); // Vacio = Todos los oficios
  selectedLocation = signal<string>(''); // Vacio = Todas las zonas

  ngOnInit(): void {
    // Cargar catálogo de oficios si no está poblado aún
    this.professionalService.loadOficios();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.emit(value.trim());
  }

  selectCategory(oficioId: string): void {
    this.selectedCategory.set(oficioId);
    this.categoryChange.emit(oficioId);
  }

  onLocationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLocation.set(value);
    this.locationChange.emit(value);
  }
}