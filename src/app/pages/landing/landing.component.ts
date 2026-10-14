import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from './sections/landing-header/landing-header.component';
import { HeroComponent } from './sections/hero/hero.component';
import { TrustedComponent } from './sections/trusted/trusted.component';
import { FeaturesComponent } from './sections/features/features.component';
import { AiRepliesComponent } from './sections/ai-replies/ai-replies.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { TimelineComponent } from './sections/timeline/timeline.component';
import { DashboardPreviewComponent } from './sections/dashboard-preview/dashboard-preview.component';
import { BeforeAfterComponent } from './sections/before-after/before-after.component';
import { SecurityResultsComponent } from './sections/security-results/security-results.component';
import { CtaComponent } from './sections/cta/cta.component';
import { LandingFooterComponent } from './sections/landing-footer/landing-footer.component';

// Section order follows the marketing "LP" reference. Pricing has its own
// dedicated /pricing page, so it's intentionally not rendered on the home scroll
// (nor are stats/moderation/testimonials/FAQ — their files are kept for reuse).
@Component({
  selector: 'app-landing',
  imports: [
    LandingHeaderComponent,
    HeroComponent,
    TrustedComponent,
    FeaturesComponent,
    AiRepliesComponent,
    HowItWorksComponent,
    TimelineComponent,
    DashboardPreviewComponent,
    BeforeAfterComponent,
    SecurityResultsComponent,
    CtaComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
