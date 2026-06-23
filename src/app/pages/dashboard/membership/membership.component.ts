import { CommonModule } from '@angular/common';
import { Component, NgZone, inject } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { PaymentService, PlanId } from '../../../shared/services/payment.service';

interface Plan {
  id: 'free' | 'pro' | 'business';
  name: string;
  tagline: string;
  monthly: number;
  features: string[];
  recommended?: boolean;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-membership',
  imports: [CommonModule, PageBreadcrumbComponent, PageHeaderComponent, ButtonComponent],
  templateUrl: './membership.component.html',
})
export class MembershipComponent {
  private readonly payments = inject(PaymentService);
  private readonly zone = inject(NgZone);

  cycle: 'monthly' | 'yearly' = 'monthly';
  currentPlan: Plan['id'] = 'free';

  status: Status = 'idle';
  message = '';
  processingPlan: Plan['id'] | null = null;

  readonly plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'Get started',
      monthly: 0,
      features: [
        '1 Instagram account',
        '100 auto-replies / month',
        '3 catalog items',
        'Basic analytics',
        'Community support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For growing creators',
      monthly: 1499,
      recommended: true,
      features: [
        '3 Instagram accounts',
        '2,000 auto-replies / month',
        '20 catalog items',
        'Follow gate + lead magnets',
        'Full analytics',
        'Email support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      tagline: 'For serious sellers',
      monthly: 3999,
      features: [
        'Unlimited Instagram accounts',
        'Unlimited auto-replies',
        'Unlimited catalog items',
        'Digital products + story & live automation',
        'Full analytics + CSV export',
        'Priority support',
      ],
    },
  ];

  /** Per-month display price (yearly applies a 28% discount). */
  perMonth(plan: Plan): number {
    return this.cycle === 'yearly' ? Math.round(plan.monthly * 0.72) : plan.monthly;
  }

  /** Total charged now for the selected cycle. */
  totalNow(plan: Plan): number {
    return this.cycle === 'yearly' ? Math.round(plan.monthly * 12 * 0.72) : plan.monthly;
  }

  ctaLabel(plan: Plan): string {
    if (plan.id === this.currentPlan) return 'Current plan';
    if (plan.monthly === 0) return 'Downgrade';
    return 'Upgrade';
  }

  async choose(plan: Plan): Promise<void> {
    if (plan.id === this.currentPlan || plan.monthly === 0) return;

    this.status = 'processing';
    this.processingPlan = plan.id;
    this.message = '';

    // The backend owns the price per plan; the client only sends the plan id.
    const planId: PlanId = plan.id === 'business' ? 'BUSINESS' : 'PRO';

    try {
      const result = await this.payments.checkout({
        plan: planId,
        billingCycle: this.cycle,
        name: 'EngageFlow AI',
        description: `${plan.name} plan (${this.cycle})`,
      });
      this.zone.run(() => {
        this.processingPlan = null;
        if (result.verified) {
          this.status = 'success';
          this.currentPlan = plan.id;
          this.message = `You're now on the ${plan.name} plan.`;
        } else {
          this.status = 'error';
          this.message = 'Payment could not be verified.';
        }
      });
    } catch (error: unknown) {
      this.zone.run(() => {
        this.processingPlan = null;
        this.status = 'error';
        this.message = error instanceof Error ? error.message : 'Payment failed.';
      });
    }
  }
}
