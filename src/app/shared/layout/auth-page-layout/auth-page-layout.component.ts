import { Component, Input } from '@angular/core';
import { GridShapeComponent } from '../../components/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';
import { ThemeToggleTwoComponent } from '../../components/common/theme-toggle-two/theme-toggle-two.component';
import { LogoComponent } from '../../components/common/logo/logo.component';

/**
 * Aurora auth shell — a centred 1100px split card on the aurora canvas:
 * left = the form pane (projected content), right = 480px dark radial brand
 * panel with a 48px grid overlay. Pages project extra panel content via
 * `[brandPanel]`; on mobile the brand panel stacks on top of the form.
 */
@Component({
  selector: 'app-auth-page-layout',
  imports: [GridShapeComponent, RouterModule, ThemeToggleTwoComponent, LogoComponent],
  templateUrl: './auth-page-layout.component.html',
  styles: ``,
})
export class AuthPageLayoutComponent {
  /** Back pill at the top of the form pane. */
  @Input() backLabel = 'Back to home';
  @Input() backLink = '/';
  /** Tagline under the logo in the brand panel. */
  @Input() tagline = 'AI-powered Instagram comment & DM automation';
}
