// src/app/models/professional.model.ts

/**
 * Entidad de Oficio (Catálogo de servicios disponibles)
 * Corresponde a la tabla `oficios` en MySQL
 */
export interface Oficio {
  id: string;             // CHAR(36) UUID
  nombre: string;         // VARCHAR(100)
  categoriaId?: string;   // CHAR(36) UUID del catálogo/categoría padre
}

/**
 * Perfil público del Trabajador / Profesional
 * Mapeado desde la relación `perfiles_trabajador` + `usuarios` en NestJS
 */
export interface ProfessionalProfile {
  id: string;             // UUID CHAR(36) del PerfilTrabajador
  usuarioId: string;      // UUID CHAR(36) del Usuario
  nombre: string;         // Viene de la relación con Usuario (VARCHAR 100)
  apellido: string;       // Viene de la relación con Usuario (VARCHAR 100)
  telefono: string;       // Para contacto directo / WhatsApp (VARCHAR 20)
  fotoUrl?: string;       // URL de la imagen de perfil
  
  // Datos del PerfilTrabajador
  descripcion?: string;   // TEXT
  experiencia?: string;   // TEXT
  zonaCobertura: string;  // VARCHAR(150) (Ej. 'Ocotlán de Morelos', 'Centro')
  disponible: boolean;    // BOOLEAN (default true)
  
  // Relación N:M con Oficios (`trabajador_oficios`)
  oficios: {
    oficio: Oficio;
    principal: boolean;   // Regla RN-03: Máximo 3 principales
  }[];
  
  // Calculados en el backend mediante agregaciones de Prisma
  promedioCalificacion?: number; // AVG(calificacion) -> FLOAT (1.0 a 5.0)
  totalResenas?: number;         // COUNT(resenas)
}

/**
 * Reseña / Calificación dejada por un cliente a un trabajador
 * Corresponde a la tabla `resenas` en MySQL
 */
export interface Review {
  id: string;             // CHAR(36) UUID de la reseña
  calificacion: number;   // TINYINT UNSIGNED (1 a 5)
  comentario?: string;    // TEXT opcional
  createdAt: string | Date; // DATETIME(3)
  cliente: {
    nombre: string;
    apellido: string;
  };
}

/**
 * Filtros aceptados por el endpoint GET /trabajadores
 */
export interface ProfessionalFilter {
  oficioId?: string;
  zona?: string;
  disponible?: boolean;
  q?: string;
}