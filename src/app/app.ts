import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent as AppNavbar } from './shared/components/navbar/navbar';// Tu navbar de Tailwind
// Importa el navbar de tu compañera si lo necesitas, o déjalo vacío para el login
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  currentUrl: string = '';

  constructor() {
    // Escucha cada cambio de ruta para actualizar la variable
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  // Verifica si estamos en la zona de autenticación
 isAuthPage(): boolean {
    // Solo se oculta tu Navbar si estás exactamente en el login o en el registro
    return this.currentUrl === '/login' || this.currentUrl === '/register';
  }
}