import { PublicacionEstado } from './job.model';

export interface JobFilter {
  oficioId?: string;       // CHAR(36) UUID del oficio
  categoriaId?: string;    // CHAR(36) UUID de la categoría
  ubicacion?: string;      // Búsqueda por municipio/zona
  estado?: PublicacionEstado; // 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA'
  q?: string;              // Búsqueda general por texto libre en título/descripción
  page?: number;           // Para la paginación según sección 9 del informe
  limit?: number;          // Cantidad de registros por página
}