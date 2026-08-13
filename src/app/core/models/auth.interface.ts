export type Role = 'CLIENTE' | 'TRABAJADOR';

// Lo que se  enviara al backend en POST /auth/register
export interface RegisterDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: Role;
  // Campos condicionales si rol === 'TRABAJADOR'
  zonaCobertura?: string;
  descripcion?: string;
}

// Lo que se enviará al backend en POST /auth/login
export interface LoginDto {
  email: string;
  password: string;
}

// Respuesta del Backend tras un Login exitoso
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: Role;
  };
}

