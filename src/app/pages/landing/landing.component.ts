import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from './sections/landing-header/landing-header.component';
import { HeroComponent } from './sections/hero/hero.component';
import { FeaturesComponent } from './sections/features/features.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { PricingComponent } from './sections/pricing/pricing.component';
import { FaqComponent } from './sections/faq/faq.component';
import { CtaComponent } from './sections/cta/cta.component';
import { LandingFooterComponent } from './sections/landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing',
  imports: [
    LandingHeaderComponent,
    HeroComponent,
    FeaturesComponent,
    HowItWorksComponent,
    PricingComponent,
    FaqComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
