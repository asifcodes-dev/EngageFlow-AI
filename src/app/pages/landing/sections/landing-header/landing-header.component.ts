import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-landing-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHeaderComponent {
  private themeService = inject(ThemeService);

  readonly theme$ = this.themeService.theme$;
  readonly mobileMenuOpen = signal(false);

  readonly navLinks = [
    { label: 'Features', fragment: 'features' },
    { label: 'How it works', fragment: 'how-it-works' },
    { label: 'Pricing', fragment: 'pricing' },
    { label: 'FAQ', fragment: 'faq' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
