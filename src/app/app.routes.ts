import { Routes } from '@angular/router';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';
import { ProfessionalFeed } from './features/jobs/components/professional-feed/professional-feed';
import { ProfessionalForm } from './features/jobs/components/professional-form/professional-form';      

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
    path: '**',
    redirectTo: '',
  },
];