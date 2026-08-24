import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si existe un usuario usando la Signal del AuthService
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigimos al login
  router.navigate(['/login']);
  return false;
};