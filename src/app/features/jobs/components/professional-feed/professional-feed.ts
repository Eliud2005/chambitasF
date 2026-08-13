import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-professional-feed',
  imports: [],
  templateUrl: './professional-feed.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalFeed {}
