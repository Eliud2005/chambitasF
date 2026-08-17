// Roles según la especificación (Enum de MySQL/Prisma)
export type Role = 'CLIENTE' | 'TRABAJADOR';

export interface RegisterDto {
  nombre: string;         // VARCHAR(100)
  apellido: string;       // VARCHAR(100)
  email: string;          // VARCHAR(150)
  telefono: string;       // VARCHAR(20)
  password: string;       // Mínimo de caracteres exigido por el DTO
  rol: Role;              // 'CLIENTE' o 'TRABAJADOR'
  
  // Campos opcionales solo si el rol es TRABAJADOR
  zonaCobertura?: string; // VARCHAR(150) - Obligatorio en backend si es TRABAJADOR
  descripcion?: string;   // TEXT
  experiencia?: string;   // TEXT
  oficioIds?: string[];   // IDs de los oficios seleccionados (máx 3 principales)
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // Opcional según RN del documento
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: Role;
    fotoUrl?: string;
  };
}