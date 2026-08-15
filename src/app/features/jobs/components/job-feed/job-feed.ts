import { Component, inject, signal, computed } from '@angular/core';
import { JobCard } from '../job-card/job-card';
import { JobFilter } from '../job-filter/job-filter';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-feed',
  imports: [JobCard, JobFilter],
  templateUrl: './job-feed.html',
})
export class JobFeed {
  jobService = inject(JobService);

  // Signals para los 3 filtros
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('Todas');
  selectedLocation = signal<string>('Todas las zonas'); // 👈 Te faltaba esta señal

  // Control de Paginación
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  // 1. Filtro base de trabajos combinando texto, categoría y ubicación
  filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const location = this.selectedLocation().trim().toLowerCase(); // 👈 Leemos la ubicación

    return this.jobService.jobs().filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);

      const matchesCategory =
        category === 'Todas' || job.category === category;

      // Comparación normalizada e insensible a mayúsculas
      const matchesLocation =
        location === 'todas las zonas' ||
        job.location.trim().toLowerCase() === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  });

  // 2. Total de páginas calculadas dinámicamente
  totalPages = computed(() =>
    Math.ceil(this.filteredJobs().length / this.pageSize())
  );

  // 3. Subconjunto de empleos correspondientes a la página actual
  paginatedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredJobs().slice(start, end);
  });

  // Manejadores de eventos del filtro
  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onCategoryFilter(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  // 👈 Te faltaba este método para recibir el evento del selector
  onLocationFilter(location: string) {
    this.selectedLocation.set(location);
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}