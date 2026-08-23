import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';      
import { JobCreateForm } from './features/jobs/components/job-create-form/job-create-form';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta raíz (puedes dejarla en login o jobs según prefieran)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas de autenticación (de tu compañera)
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },

  // Perfil y trabajadores (de tu compañera)
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
  },
  {
    path: 'trabajadores/:id',
    loadComponent: () => import('./pages/worker-detail/worker-detail').then(m => m.WorkerDetailComponent)
  },
  {
    path: 'trabajadores',
    loadComponent: () => import('./pages/worker-list/worker-list').then(m => m.WorkerListComponent)
  },

  // Tus rutas de empleos y profesionales (DiamondCode)
  {
    path: 'jobs',
    component: JobFeed,
  },
  {
    path: 'registro-profesional',
    component: ProfessionalForm,
  },
  {
    path: 'registro-empleo',
    component: JobCreateForm,
  },
  {
    path: 'directorio',
    component: ProfessionalFeed,
  },

  // Ruta comodín para URLs no encontradas
  { path: '**', redirectTo: 'login' },
];