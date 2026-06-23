import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
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
    BadgeComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
    LabelComponent,
    InputFieldComponent,
  ],
  templateUrl: './earnings.component.html',
})
export class EarningsComponent {
  private readonly earnings = inject(EarningsService);
  readonly payouts$ = this.earnings.payouts$;

  // Shared payout (bank) account — persists to backend later.
  bankName = '';
  ifsc = '';
  accountNumber = '';
  holder = '';
  saved = false;

  readonly icons = {
    rupee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12M6 8h12M9 4c4 0 5 8-3 8l6 8"/></svg>`,
    fee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 5 5 19M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>`,
    wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8m-4 4h.01"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
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

  statusColor(status: PayoutStatus): 'success' | 'warning' | 'info' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
    }
  }

  trackPayout(_index: number, payout: Payout): string {
    return payout.id;
  }
}
