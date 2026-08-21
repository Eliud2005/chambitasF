import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';      
import { JobCreateForm } from './features/jobs/components/job-create-form/job-create-form';

export const routes: Routes = [
  // Rutas de autenticación creadas por tu compañera
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
  {
    path: 'profesional-feed',
    component: ProfessionalFeed,
  },

  // Ruta comodín por si escriben cualquier otra cosa
  { path: '**', redirectTo: 'login' },
];