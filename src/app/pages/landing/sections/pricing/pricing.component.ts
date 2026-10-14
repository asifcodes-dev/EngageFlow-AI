import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Feature {
  label: string;
  ok: boolean;
}

interface Plan {
  name: string;
  /** Tier badge tint. */
  badge: 'blue' | 'violet';
  tagline: string;
  price: number;
  recommended?: boolean;
  /** Base social-account allowance (highlighted box). */
  accounts: string;
  /** Per-extra-account add-on (display-only marketing note; omitted when unlimited). */
  extraAccount?: string;
  /** Core "what's included" checklist (✓ included / ✗ not). */
  features: Feature[];
  /** Flagship features — rendered as filled pills when included, grey ✗ otherwise. */
  premium: Feature[];
  cta: string;
}

/**
 * Marketing pricing — Pro / Max (paid-only, prices unchanged). Presentation
 * upgraded per the client mock: tier badge, tagline, an "accounts included" +
 * "extra account" box, a ✓/✗ inclusion list, and flagship features as pills.
 */
@Component({
  selector: 'app-landing-pricing',
  imports: [CommonModule, RouterModule, RevealDirective],
  templateUrl: './pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  readonly plans: Plan[] = [
    {
      name: 'Pro',
      badge: 'blue',
      tagline: 'Perfect for creators & small businesses getting started.',
      price: 1499,
      recommended: true,
      accounts: '3 Instagram accounts',
      extraAccount: '+₹299 / extra account',
      features: [
        { label: 'Unlimited automations', ok: true },
        { label: '2,000 auto-replies / month', ok: true },
        { label: 'Ask for follow + lead magnets', ok: true },
        { label: 'Lead generation & CRM', ok: true },
        { label: 'Sell coupons & products', ok: true },
        { label: 'Free templates', ok: true },
        { label: 'Email support', ok: true },
      ],
      premium: [
        { label: 'Digital product sales', ok: false },
        { label: 'Story & Live automation', ok: false },
        { label: 'Advanced analytics + CSV export', ok: false },
        { label: 'Priority support', ok: false },
      ],
      cta: 'Choose Pro',
    },
    {
      name: 'Max',
      badge: 'violet',
      tagline: 'For growing businesses that want everything, unlimited.',
      price: 3999,
      accounts: 'Unlimited accounts',
      features: [
        { label: 'Unlimited automations', ok: true },
        { label: 'Unlimited auto-replies', ok: true },
        { label: 'Ask for follow + lead magnets', ok: true },
        { label: 'Lead generation & CRM', ok: true },
        { label: 'Sell coupons & products', ok: true },
        { label: 'Free templates', ok: true },
      ],
      premium: [
        { label: 'Digital product sales', ok: true },
        { label: 'Story & Live automation', ok: true },
        { label: 'Advanced analytics + CSV export', ok: true },
        { label: 'Priority support', ok: true },
      ],
      cta: 'Choose Max',
    },
  ];
}
