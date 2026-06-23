import { Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { PaymentService, PlanId } from '../../../shared/services/payment.service';

interface PlanPick {
  id: PlanId;
  name: string;
  price: string;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-billing',
  imports: [CommonModule, PageBreadcrumbComponent, ButtonComponent],
  templateUrl: './billing.component.html',
  styles: ``,
})
export class BillingComponent {
  private readonly payments = inject(PaymentService);
  private readonly zone = inject(NgZone);

  status: Status = 'idle';
  message = '';
  paymentId = '';
  processingPlan: PlanId | null = null;

  // Prices are display-only; the real amount is enforced server-side by plan.
  readonly plans: PlanPick[] = [
    { id: 'PRO', name: 'Pro', price: '₹1,499 / month' },
    { id: 'BUSINESS', name: 'Business', price: '₹3,999 / month' },
  ];

  get processing(): boolean {
    return this.status === 'processing';
  }

  async pay(plan: PlanPick): Promise<void> {
    this.status = 'processing';
    this.processingPlan = plan.id;
    this.message = '';
    this.paymentId = '';

    try {
      const result = await this.payments.checkout({
        plan: plan.id,
        name: 'EngageFlow AI',
        description: `${plan.name} plan — monthly`,
      });
      // Razorpay's callback can fire outside Angular's zone; re-enter so the view updates.
      this.zone.run(() => {
        this.processingPlan = null;
        if (result.verified) {
          this.status = 'success';
          this.paymentId = result.paymentId;
          this.message = 'Payment verified successfully.';
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
