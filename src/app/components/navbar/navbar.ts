import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  currentUser: any = null;

  ngOnInit(): void {
    this.checkSession();

    // Escucha cada cambio de pantalla para verificar el estado de la sesión
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkSession();
    });
  }

  checkSession(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    } else {
      this.currentUser = null;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser = null;
    alert('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }
}