import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './worker-list.html',
})
export class WorkerListComponent implements OnInit {
  workers: any[] = [];

  private oficiosMap: { [key: string]: string } = {
    '1': 'Plomería',
    '2': 'Electricidad',
    '3': 'Carpintería',
    '4': 'Pintura',
    '5': 'Jardinería',
    '6': 'Albañilería'
  };

  ngOnInit(): void {
    const savedWorkers = localStorage.getItem('workers_list');

    if (savedWorkers) {
      const rawWorkers = JSON.parse(savedWorkers);
      // Mapea los IDs de oficios a texto legible
      this.workers = rawWorkers.map((w: any) => ({
        ...w,
        oficios: Array.isArray(w.oficios)
          ? w.oficios.map((id: string) => this.oficiosMap[id] || id)
          : []
      }));
    } else {
      this.workers = [];
    }
  }
}
