import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from '../landing/sections/landing-header/landing-header.component';
import { HowItWorksComponent } from '../landing/sections/how-it-works/how-it-works.component';
import { TimelineComponent } from '../landing/sections/timeline/timeline.component';
import { CtaComponent } from '../landing/sections/cta/cta.component';
import { LandingFooterComponent } from '../landing/sections/landing-footer/landing-footer.component';

/** Dedicated /how-it-works page — the 3-step flow + "a day with EngageFlow" timeline. */
@Component({
  selector: 'app-how-it-works-page',
  imports: [
    LandingHeaderComponent,
    HowItWorksComponent,
    TimelineComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  template: `
    <div class="min-h-screen bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <app-landing-header />
      <main>
        <app-landing-how-it-works />
        <app-landing-timeline />
        <app-landing-cta />
      </main>
      <app-landing-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksPageComponent {}
