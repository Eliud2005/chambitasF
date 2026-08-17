import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfessionalCard } from '../professional-card/professional-card';
import { ProfessionalService } from '../../services/professional.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-professional-feed',
  standalone: true,
  imports: [ProfessionalCard, RouterLink, RouterLinkActive],
  templateUrl: './professional-feed.html',
  host: {
    class: 'block'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalFeed {
  private professionalService = inject(ProfessionalService);

  professionals = this.professionalService.professionals;
}