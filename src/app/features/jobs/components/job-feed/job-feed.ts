import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { JobCard } from '../job-card/job-card';
import { JobFilter } from '../job-filter/job-filter';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-feed',
  standalone: true,
  imports: [JobCard, JobFilter],
  templateUrl: './job-feed.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFeed {
  protected jobService = inject(JobService);

  // Señales para controlar los 3 filtros (valores iniciales vacíos)
  searchQuery = signal<string>('');
  selectedCategory = signal<string>(''); // Vacio = Todos los oficios / ID del oficio
  selectedLocation = signal<string>(''); // Vacio = Todas las zonas

  // Control de Paginación
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  // 1. Filtro reactivo en memoria combinando texto, categoría/oficio y zona
  filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const categoryId = this.selectedCategory();
    const location = this.selectedLocation().trim().toLowerCase();

    return this.jobService.jobs().filter((job) => {
      // Coincidencia por texto en nombre, título o descripción
    // Coincidencia por texto en título o descripción
const matchesSearch =
  !query ||
  job.titulo.toLowerCase().includes(query) ||
  job.descripcion.toLowerCase().includes(query) ||
  (job.oficioNombre ? job.oficioNombre.toLowerCase().includes(query) : false);

// Coincidencia por oficio (oficioId)
const matchesCategory =
  !categoryId ||
  job.oficioId === categoryId;

// Coincidencia por ubicación
const matchesLocation =
  !location ||
  job.ubicacion.toLowerCase().includes(location);

return matchesSearch && matchesCategory && matchesLocation;
      
    });
  });

  // 2. Total de páginas calculadas dinámicamente
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredJobs().length / this.pageSize()))
  );

  // 3. Subconjunto de elementos para la página actual
  paginatedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredJobs().slice(start, end);
  });

  // Manejadores de eventos emitidos desde <app-job-filter />
  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onCategoryFilter(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  onLocationFilter(location: string): void {
    this.selectedLocation.set(location);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}