import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';      
import { JobCreateForm } from './features/jobs/components/job-create-form/job-create-form';
import { ProfessionalCard } from './features/jobs/components/professional-card/professional-card';

export const routes: Routes = [
  // Ruta principal: Tablón de Empleos / Solicitudes
  {
    path: '',
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
  {
    path: '**',
    redirectTo: '',
  },
];