import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from './sections/landing-header/landing-header.component';
import { HeroComponent } from './sections/hero/hero.component';
import { StatsComponent } from './sections/stats/stats.component';
import { TrustedComponent } from './sections/trusted/trusted.component';
import { FeaturesComponent } from './sections/features/features.component';
import { AiRepliesComponent } from './sections/ai-replies/ai-replies.component';
import { ModerationComponent } from './sections/moderation/moderation.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { PricingComponent } from './sections/pricing/pricing.component';
import { FaqComponent } from './sections/faq/faq.component';
import { CtaComponent } from './sections/cta/cta.component';
import { LandingFooterComponent } from './sections/landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing',
  imports: [
    LandingHeaderComponent,
    HeroComponent,
    StatsComponent,
    TrustedComponent,
    FeaturesComponent,
    AiRepliesComponent,
    ModerationComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    PricingComponent,
    FaqComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
