import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
  cta: string;
  features: string[];
}

@Component({
  selector: 'app-landing-pricing',
  imports: [CommonModule, RouterModule],
  templateUrl: './pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  readonly tiers: Tier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'For getting started and testing the waters.',
      featured: false,
      cta: 'Start For Free',
      features: [
        '1 Instagram account',
        '100 auto-replies / month',
        '3 product catalog items',
        'Basic analytics',
        'Community support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹1,499',
      period: '/month',
      description: 'For growing creators and small businesses.',
      featured: true,
      cta: 'Start Pro Trial',
      features: [
        '3 Instagram accounts',
        '2,000 auto-replies / month',
        '20 product catalog items',
        'Follow Gate automation',
        'Lead magnets',
        'Full analytics',
        'Email support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: '₹3,999',
      period: '/month',
      description: 'For scaling stores selling digital products.',
      featured: false,
      cta: 'Choose Business',
      features: [
        'Unlimited Instagram accounts',
        'Unlimited auto-replies',
        'Unlimited catalog items',
        'Lead magnets + digital products',
        'Story + Live automation',
        'Full analytics + CSV export',
        'Priority support',
      ],
    },
  ];
}
