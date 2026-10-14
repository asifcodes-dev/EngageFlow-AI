import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../../../shared/components/common/logo/logo.component';

interface NavLink {
  label: string;
  route: string;
  /** Match the active route exactly (needed for '/' so Home isn't always active). */
  exact?: boolean;
}

@Component({
  selector: 'app-landing-header',
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './landing-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHeaderComponent {
  readonly mobileMenuOpen = signal(false);

  readonly navLinks: NavLink[] = [
    { label: 'Home', route: '/', exact: true },
    { label: 'Features', route: '/features' },
    { label: 'How it works', route: '/how-it-works' },
    { label: 'Pricing', route: '/pricing' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
