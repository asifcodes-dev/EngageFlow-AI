import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AuthService, PlanUsage } from '../../../shared/services/auth.service';
import { PaymentService, PlanId } from '../../../shared/services/payment.service';

interface Feature {
  label: string;
  ok: boolean;
}

interface Plan {
  id: 'pro' | 'business';
  name: string;
  tagline: string;
  monthly: number;
  /** Base social-account allowance (highlighted box). */
  accounts: string;
  /** Per-extra-account add-on (display-only; omitted when unlimited). */
  extraAccount?: string;
  /** Core "what's included" checklist (✓ included / ✗ not). */
  features: Feature[];
  /** Flagship features — filled pills when included, grey ✗ otherwise. */
  premium: Feature[];
  recommended?: boolean;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-membership',
  imports: [CommonModule, PageBreadcrumbComponent, PageHeaderComponent, ButtonComponent],
  templateUrl: './membership.component.html',
})
export class MembershipComponent implements OnInit {
  private readonly payments = inject(PaymentService);
  private readonly auth = inject(AuthService);
  private readonly zone = inject(NgZone);

  cycle: 'monthly' | 'yearly' = 'monthly';
  /** The user's active plan, or 'none' until they purchase one. */
  currentPlan: Plan['id'] | 'none' = 'none';
  /** Live plan usage (products/flows used vs limits); null until loaded. */
  usage: PlanUsage | null = null;

  status: Status = 'idle';
  message = '';
  processingPlan: Plan['id'] | null = null;

  /** Trial state (from /auth/me + /auth/usage). */
  trialUsed = false;
  isTrialing = false;
  trialDaysLeft = 0;
  startingTrial = false;

  /** The plan the "Upgrade now" trial CTA points at (the recommended tier). */
  get recommendedPlan(): Plan {
    return this.plans.find((p) => p.recommended) ?? this.plans[0];
  }

  readonly plans: Plan[] = [
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For growing creators',
      monthly: 1499,
      recommended: true,
      accounts: '3 Instagram accounts',
      extraAccount: '+₹299 / extra account',
      features: [
        { label: 'Unlimited automations', ok: true },
        { label: '2,000 auto-replies / month', ok: true },
        { label: '20 catalog items', ok: true },
        { label: 'Follow gate + lead magnets', ok: true },
        { label: 'Full analytics', ok: true },
        { label: 'Email support', ok: true },
      ],
      premium: [
        { label: 'Digital product sales', ok: false },
        { label: 'Story & Live automation', ok: false },
        { label: 'Advanced analytics + CSV export', ok: false },
        { label: 'Priority support', ok: false },
      ],
    },
    {
      id: 'business',
      name: 'Max',
      tagline: 'For serious sellers',
      monthly: 3999,
      accounts: 'Unlimited accounts',
      features: [
        { label: 'Unlimited automations', ok: true },
        { label: 'Unlimited auto-replies', ok: true },
        { label: 'Unlimited catalog items', ok: true },
        { label: 'Follow gate + lead magnets', ok: true },
        { label: 'Full analytics', ok: true },
      ],
      premium: [
        { label: 'Digital product sales', ok: true },
        { label: 'Story & Live automation', ok: true },
        { label: 'Advanced analytics + CSV export', ok: true },
        { label: 'Priority support', ok: true },
      ],
    },
  ];

  ngOnInit(): void {
    // Reflect the buyer's real tier from the backend (null = no active plan).
    this.auth.me().subscribe({
      next: (user) => {
        this.currentPlan =
          user.subscriptionTier === 'PRO'
            ? 'pro'
            : user.subscriptionTier === 'BUSINESS'
              ? 'business'
              : 'none';
        this.trialUsed = !!user.trialStartedAt;
      },
      error: () => {
        /* not signed in or backend unreachable — leave as 'none' */
      },
    });
    this.loadUsage();
  }

  private loadUsage(): void {
    this.auth.usage().subscribe({
      next: (u) => {
        this.usage = u;
        this.isTrialing = u.isTrialing;
        this.trialDaysLeft = u.trialDaysLeft;
      },
      error: () => (this.usage = null),
    });
  }

  /** "used / limit" label, or "used / Unlimited" when the limit is null. */
  usageLabel(used: number, limit: number | null): string {
    return `${used} / ${limit ?? 'Unlimited'}`;
  }

  /** Bar fill percent (0 when unlimited so the bar stays empty). */
  usagePercent(used: number, limit: number | null): number {
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  }

  /**
   * Per-month display price (yearly applies a ~28% discount, rounded to the
   * nearest rupee). This is the single source of truth for the yearly
   * cycle — `totalNow` derives from it, so the two labels always agree.
   */
  perMonth(plan: Plan): number {
    return this.cycle === 'yearly' ? Math.round(plan.monthly * 0.72) : plan.monthly;
  }

  /**
   * Total charged now for the selected cycle: exactly `perMonth * 12` for
   * yearly, so "Billed ₹X/year" always equals the displayed monthly rate
   * times 12 — this must also match the backend's PLAN_PRICES.yearly
   * (payments.service.ts) exactly, since that's what Razorpay actually charges.
   */
  totalNow(plan: Plan): number {
    return this.cycle === 'yearly' ? this.perMonth(plan) * 12 : plan.monthly;
  }

  ctaLabel(plan: Plan): string {
    if (plan.id === this.currentPlan) return 'Current plan';
    return this.currentPlan === 'none' ? `Choose ${plan.name}` : 'Switch plan';
  }

  /** "/month" or "/month · billed yearly" (reference perNote). */
  get perNote(): string {
    return this.cycle === 'yearly' ? '/month · billed yearly' : '/month';
  }

  /** Line under the billing toggle (reference billNote). */
  get billNote(): string {
    if (this.cycle === 'yearly') {
      const totals = this.plans.map((p) => {
        const t = Math.round(p.monthly * 0.72) * 12;
        return `₹${t.toLocaleString('en-IN')} (${p.name})`;
      });
      return `Billed yearly: ${totals.join(' · ')} — you save 28%`;
    }
    return 'Switch to yearly billing and save 28%';
  }

  /** "Trial ends 9 July" style date from the remaining days. */
  get trialEndLabel(): string {
    const d = new Date(Date.now() + this.trialDaysLeft * 86_400_000);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  }

  /** Display label for a plan id (the top tier is branded "Max"). */
  planLabel(id: Plan['id']): string {
    return id === 'business' ? 'Max' : 'Pro';
  }

  /** Begin the one-time 7-day free trial. */
  startTrial(): void {
    this.startingTrial = true;
    this.message = '';
    this.auth.startTrial().subscribe({
      next: () => {
        this.startingTrial = false;
        this.trialUsed = true;
        this.status = 'success';
        this.message = 'Your 7-day free trial is active.';
        this.loadUsage();
      },
      error: (err: unknown) => {
        this.startingTrial = false;
        this.status = 'error';
        this.message =
          err instanceof HttpErrorResponse && typeof err.error?.message === 'string'
            ? err.error.message
            : 'Could not start your trial. Please try again.';
      },
    });
  }

  async choose(plan: Plan): Promise<void> {
    if (plan.id === this.currentPlan) return;

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
