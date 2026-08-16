export type Role = 'CLIENTE' | 'TRABAJADOR';


export interface RegisterDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: Role;

  zonaCobertura?: string;
  descripcion?: string;
}


export interface LoginDto {
  email: string;
  password: string;
}


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

