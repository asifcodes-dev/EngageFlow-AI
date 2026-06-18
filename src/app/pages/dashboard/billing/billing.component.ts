import { Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { PaymentService } from '../../../shared/services/payment.service';

interface PlanPick {
  id: string;
  name: string;
  amount: number;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-billing',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
  ],
  templateUrl: './billing.component.html',
  styles: ``,
})
export class BillingComponent {
  private readonly payments = inject(PaymentService);
  private readonly zone = inject(NgZone);

  amount = '1499';
  currency = 'INR';
  submitted = false;

  status: Status = 'idle';
  message = '';
  paymentId = '';

  readonly currencyOptions: Option[] = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  readonly plans: PlanPick[] = [
    { id: 'pro', name: 'Pro', amount: 1499 },
    { id: 'business', name: 'Business', amount: 3999 },
  ];

  get amountError(): string {
    if (!this.submitted) return '';
    if (!this.amount.trim()) return 'Amount is required.';
    const value = Number(this.amount);
    if (!Number.isFinite(value) || value <= 0) return 'Enter a valid amount greater than 0.';
    return '';
  }

  get processing(): boolean {
    return this.status === 'processing';
  }

  pickPlan(plan: PlanPick): void {
    this.amount = String(plan.amount);
    this.currency = 'INR';
  }

  async pay(): Promise<void> {
    this.submitted = true;
    if (this.amountError) return;

    this.status = 'processing';
    this.message = '';
    this.paymentId = '';

    try {
      const result = await this.payments.checkout({
        amount: Number(this.amount),
        currency: this.currency,
        name: 'EngageFlow AI',
        description: `Test payment — ${this.currency} ${this.amount}`,
      });
      // Razorpay's callback can fire outside Angular's zone; re-enter so the view updates.
      this.zone.run(() => {
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
        this.status = 'error';
        this.message = error instanceof Error ? error.message : 'Payment failed.';
      });
    }
  }
}
