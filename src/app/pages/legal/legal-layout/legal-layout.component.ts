import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LandingHeaderComponent } from '../../landing/sections/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/sections/landing-footer/landing-footer.component';

/**
 * Shared chrome for the public legal pages (Privacy, Terms, Refund).
 * Reuses the landing header/footer and renders a titled hero plus a
 * styled content area. Page content is projected via <ng-content>.
 */
@Component({
  selector: 'app-legal-layout',
  imports: [LandingHeaderComponent, LandingFooterComponent],
  templateUrl: './legal-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalLayoutComponent {
  readonly eyebrow = input<string>('Legal');
  readonly title = input.required<string>();
  readonly intro = input<string>('');
  readonly lastUpdated = input<string>('');
}
