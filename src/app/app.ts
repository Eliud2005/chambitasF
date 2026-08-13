import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { JobFeed } from './features/jobs/components/job-feed/job-feed';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar, JobFeed], // Importa los componentes necesarios
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chambitasF');
}
