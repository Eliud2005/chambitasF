import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { JobCard } from '../job-card/job-card';
import { JobFilter } from '../job-filter/job-filter';
import { JobService } from '../../services/job.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-job-feed',
  standalone: true,
  imports: [JobCard, JobFilter, RouterLink, RouterLinkActive],
  templateUrl: './job-feed.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFeed implements OnInit {
  protected jobService = inject(JobService);

  // Señales de filtros de interfaz
  searchQuery = signal<string>('');
  selectedCategory = signal<string>(''); // Vacío = Todos / ID del oficio
  selectedLocation = signal<string>(''); // Vacío = Todas las zonas

  // Paginación
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  ngOnInit(): void {
    // Carga inicial de publicaciones de empleo desde la API de NestJS
    this.jobService.loadJobs();
  }

  // 1. Filtro reactivo combinando los datos devueltos por el backend
  filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const categoryId = this.selectedCategory();
    const location = this.selectedLocation().trim().toLowerCase();

    return this.jobService.jobs().filter((job: any) => {
      // Coincidencia por texto en título, descripción o nombre del oficio
      const oficioNombre = job.oficio?.nombre || job.oficioNombre || '';
      const matchesSearch =
        !query ||
        job.titulo?.toLowerCase().includes(query) ||
        job.descripcion?.toLowerCase().includes(query) ||
        oficioNombre.toLowerCase().includes(query);

      // Coincidencia por ID de oficio
      const jobOficioId = job.oficioId || job.oficio?.id || '';
      const matchesCategory = !categoryId || jobOficioId === categoryId;

      // Coincidencia por ubicación / zona
      const matchesLocation =
        !location ||
        job.ubicacion?.toLowerCase().includes(location);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  });

  // 2. Cálculo dinámico de páginas totales
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredJobs().length / this.pageSize()))
  );

  // 3. Obtención del subconjunto paginado para la vista
  paginatedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredJobs().slice(start, end);
  });

  // Escuchadores de eventos de filtros
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