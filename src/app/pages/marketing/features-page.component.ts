import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from '../landing/sections/landing-header/landing-header.component';
import { FeaturesComponent } from '../landing/sections/features/features.component';
import { AiRepliesComponent } from '../landing/sections/ai-replies/ai-replies.component';
import { CtaComponent } from '../landing/sections/cta/cta.component';
import { LandingFooterComponent } from '../landing/sections/landing-footer/landing-footer.component';

/** Dedicated /features marketing page — the features grid + AI-replies showcase. */
@Component({
  selector: 'app-features-page',
  imports: [
    LandingHeaderComponent,
    FeaturesComponent,
    AiRepliesComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  template: `
    <div class="min-h-screen bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <app-landing-header />
      <main>
        <app-landing-features />
        <app-landing-ai-replies />
        <app-landing-cta />
      </main>
      <app-landing-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesPageComponent {}
