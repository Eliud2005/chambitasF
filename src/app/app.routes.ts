import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';      
import { JobCreateForm } from './features/jobs/components/job-create-form/job-create-form';

export const routes: Routes = [
  // 1. Redirigir la raíz al feed de empleos (en lugar del login)
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },

  // Rutas de autenticación
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },

  // Tus rutas de empleos y profesionales
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
  // 2. Renombrar 'profesional-feed' a 'directorio' para que coincida con el Header
  {
    path: 'directorio',
    component: ProfessionalFeed,
  },

  // Ruta comodín para URLs no encontradas
  { path: '**', redirectTo: 'jobs' },
];