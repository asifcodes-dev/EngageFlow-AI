import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../shared/services/payment.service';

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
  cta: string;
  /** Monthly price in rupees, or null for the free plan (which routes to signup). */
  amount: number | null;
  features: string[];
}

@Component({
  selector: 'app-landing-pricing',
  imports: [CommonModule, RouterModule],
  templateUrl: './pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  private readonly payments = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  processingTierId: string | null = null;
  notice = '';
  noticeType: 'success' | 'error' | '' = '';

  readonly tiers: Tier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'For getting started and testing the waters.',
      featured: false,
      cta: 'Start For Free',
      amount: null,
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
      amount: 1499,
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
      amount: 3999,
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

  onCta(tier: Tier): void {
    if (tier.amount === null) {
      this.router.navigate(['/signup'], { queryParams: { plan: tier.id } });
      return;
    }
    void this.startCheckout(tier);
  }

  private async startCheckout(tier: Tier): Promise<void> {
    if (tier.amount === null) return;
    this.processingTierId = tier.id;
    this.notice = '';
    this.noticeType = '';

    try {
      const result = await this.payments.checkout({
        amount: tier.amount,
        currency: 'INR',
        name: 'EngageFlow AI',
        description: `${tier.name} plan — monthly`,
      });
      // Razorpay's callback can fire outside Angular's zone; re-enter for change detection.
      this.zone.run(() => {
        this.processingTierId = null;
        if (result.verified) {
          this.router.navigate(['/signup'], { queryParams: { plan: tier.id, paid: '1' } });
        } else {
          this.noticeType = 'error';
          this.notice = 'Payment could not be verified.';
        }
        this.cdr.markForCheck();
      });
    } catch (error: unknown) {
      this.zone.run(() => {
        this.processingTierId = null;
        this.noticeType = 'error';
        this.notice = error instanceof Error ? error.message : 'Payment failed.';
        this.cdr.markForCheck();
      });
    }
  }
}
