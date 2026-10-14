import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-landing-hero',
  imports: [RouterModule, CountUpDirective, RevealDirective],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  /** Hero proof-point stat cards. `count` is the numeric count-up target; the
   *  string `value` stays in the HTML as the final formatted display. */
  readonly stats: { value: string; label: string; count: number }[] = [
    { value: '10K+', label: 'Replies / day', count: 10000 },
    { value: '12+', label: 'Languages', count: 12 },
    { value: '<3s', label: 'Avg response', count: 3 },
  ];
}
