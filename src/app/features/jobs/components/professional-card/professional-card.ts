import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-professional-card',
  imports: [],
  templateUrl: './professional-card.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalCard {}
