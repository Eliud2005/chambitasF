import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },
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
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
