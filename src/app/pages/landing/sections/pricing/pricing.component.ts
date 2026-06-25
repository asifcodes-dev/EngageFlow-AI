import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { PaymentService } from '../../../../shared/services/payment.service';

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
  cta: string;
  /** Monthly price in rupees. */
  amount: number;
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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  processingTierId: string | null = null;
  notice = '';
  noticeType: 'success' | 'error' | '' = '';

  readonly tiers: Tier[] = [
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
    // Anyone not signed in goes to signup first — paid checkout requires an
    // authenticated user (the payments API is JWT-guarded).
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/signup'], { queryParams: { plan: tier.id } });
      return;
    }
    void this.startCheckout(tier);
  }

  private async startCheckout(tier: Tier): Promise<void> {
    this.processingTierId = tier.id;
    this.notice = '';
    this.noticeType = '';

    try {
      const result = await this.payments.checkout({
        plan: tier.id === 'business' ? 'BUSINESS' : 'PRO',
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
