import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from '../landing/sections/landing-header/landing-header.component';
import { PricingComponent } from '../landing/sections/pricing/pricing.component';
import { SecurityResultsComponent } from '../landing/sections/security-results/security-results.component';
import { CtaComponent } from '../landing/sections/cta/cta.component';
import { LandingFooterComponent } from '../landing/sections/landing-footer/landing-footer.component';

/** Dedicated /pricing page — the Pro/Max plans + trust & results, then the CTA. */
@Component({
  selector: 'app-pricing-page',
  imports: [
    LandingHeaderComponent,
    PricingComponent,
    SecurityResultsComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  template: `
    <div class="min-h-screen bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <app-landing-header />
      <main>
        <app-landing-pricing />
        <app-landing-security-results />
        <app-landing-cta />
      </main>
      <app-landing-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPageComponent {}
