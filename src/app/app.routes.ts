import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';     
import { JobCreateForm } from './features/jobs/components/job-create-form/job-create-form';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirección por defecto
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },

  // Rutas de autenticación (Públicas)
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },

  // Exploración de empleos y profesionales (Públicas para consulta libre)
  {
    path: 'jobs',
    component: JobFeed,
  },
  {
    path: 'directorio',
    component: ProfessionalFeed,
  },
  {
    path: 'trabajadores',
    loadComponent: () => import('./pages/worker-list/worker-list').then(m => m.WorkerListComponent)
  },
  {
    path: 'trabajadores/:id',
    loadComponent: () => import('./pages/worker-detail/worker-detail').then(m => m.WorkerDetailComponent)
  },

  // --------------------------------------------------------------------------
  // Rutas Protegidas (Requieren usuario autenticado)
  // --------------------------------------------------------------------------
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'registro-profesional',
    component: ProfessionalForm,
    canActivate: [authGuard]
  },
  {
    path: 'registro-empleo',
    component: JobCreateForm,
    canActivate: [authGuard]
  },

  // Ruta comodín para URLs no encontradas
  { path: '**', redirectTo: 'jobs' },
];