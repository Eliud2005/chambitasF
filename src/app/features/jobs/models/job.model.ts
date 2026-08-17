// Estados de la publicación según la especificación (ENUM en MySQL/Prisma)
export type PublicacionEstado = 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA';

export interface JobPost {
  id: string;                 // CHAR(36) UUID
  clienteId?: string;         // CHAR(36) UUID
  oficioId: string;           // CHAR(36) UUID de la tabla oficios
  oficioNombre?: string;      // Opcional para mostrar en la interfaz (ej. 'Plomería')
  titulo: string;             // VARCHAR(150)
  descripcion: string;        // TEXT
  ubicacion: string;          // VARCHAR(200)
  presupuesto?: number;       // DECIMAL(10,2) - RN-13: Opcional
  estado: PublicacionEstado;  // ENUM
  createdAt: Date | string;   // DATETIME(3)
  updatedAt?: Date | string;  // DATETIME(3)
}

// DTO que se envía en la petición POST /publicaciones
export interface CreateJobDto {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  oficioId: string;
  presupuesto?: number;
}