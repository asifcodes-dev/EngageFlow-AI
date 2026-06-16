import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  /** In-page anchor or external URL. */
  href?: string;
  /** Internal router path; takes precedence over href when set. */
  route?: string;
}

@Component({
  selector: 'app-landing-footer',
  imports: [RouterModule],
  templateUrl: './landing-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingFooterComponent {
  readonly year = new Date().getFullYear();

  readonly productLinks: FooterLink[] = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  readonly companyLinks: FooterLink[] = [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  readonly legalLinks: FooterLink[] = [
    { label: 'Privacy Policy', route: '/privacy-policy' },
    { label: 'Terms of Service', route: '/terms-of-service' },
    { label: 'Refund Policy', route: '/refund-policy' },
  ];
}
