import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { EarningsService, Payout, PayoutStatus } from './earnings.service';

@Component({
  selector: 'app-earnings',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    EmptyStateComponent,
    ButtonComponent,
  ],
  templateUrl: './earnings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarningsComponent implements OnInit {
  private readonly earnings = inject(EarningsService);
  readonly summary$ = this.earnings.summary$;
  readonly payouts$ = this.earnings.payouts$;

  ngOnInit(): void {
    this.earnings.load().subscribe({ error: () => undefined });
  }

  // Payout (bank) account — persists to backend later (deliberate local stub).
  bankName = '';
  ifsc = '';
  accountNumber = '';
  holder = '';
  saved = false;

  readonly icons = {
    sales: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 3v18h18"/><path d="m7 14 3-3 3 3 5-5"/></svg>`,
    fee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>`,
  };

  saveAccount(): void {
    this.saved = true;
  }

  money(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /** Grey "−₹X" figure for the fee card. */
  negMoney(amount: number, currency = 'INR'): string {
    return amount > 0 ? `−${this.money(amount, currency)}` : this.money(0, currency);
  }

  /** "Next payout 7 July" — payouts run weekly on Mondays. */
  get nextPayoutLabel(): string {
    const d = new Date();
    const days = (8 - d.getDay()) % 7 || 7; // next Monday
    d.setDate(d.getDate() + days);
    return `Next payout ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
  }

  paidCount(payouts: Payout[]): number {
    return payouts.filter((p) => p.status === 'paid').length;
  }

  /** Reference maps a scheduled payout to a blue "Upcoming" pill. */
  statusLabel(status: PayoutStatus): string {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Upcoming';
    }
  }

  pillClass(status: PayoutStatus): string {
    return status === 'paid' ? 'au-pill-green' : 'au-pill-blue';
  }

  /** IFSC format looks complete → show the green "Verified" chip (UI-only). */
  get ifscLooksValid(): boolean {
    return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(this.ifsc.trim());
  }

  trackPayout(_index: number, payout: Payout): string {
    return payout.id;
  }
}
