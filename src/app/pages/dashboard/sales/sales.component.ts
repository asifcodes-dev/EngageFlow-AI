import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { Order, OrderStatus, SalesService } from './sales.service';
import { downloadCsv } from '../../../shared/utils/csv.util';

@Component({
  selector: 'app-sales',
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
    InputFieldComponent,
    SelectComponent,
  ],
  templateUrl: './sales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {
  private readonly sales = inject(SalesService);
  readonly orders$ = this.sales.orders$;

  search = '';
  statusFilter = 'all';

  readonly statusOptions: Option[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  readonly icons = {
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    rupee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12M6 8h12M9 4c4 0 5 8-3 8l6 8"/></svg>`,
  };

  filtered(orders: Order[]): Order[] {
    const q = this.search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = this.statusFilter === 'all' || o.status === this.statusFilter;
      const matchesQuery =
        !q ||
        o.ref.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }

  count(orders: Order[], status: OrderStatus): number {
    return orders.filter((o) => o.status === status).length;
  }

  revenue(orders: Order[]): string {
    const total = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0);
    return formatMoney(total, orders[0]?.currency ?? 'INR');
  }

  money(amount: number, currency: string): string {
    return formatMoney(amount, currency);
  }

  statusColor(status: OrderStatus): 'success' | 'warning' | 'error' | 'light' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'light';
    }
  }

  export(orders: Order[]): void {
    downloadCsv(
      'orders.csv',
      ['Ref', 'Product', 'Customer', 'Email', 'Amount', 'Status', 'Delivery', 'Created'],
      orders.map((o) => [
        o.ref,
        o.product,
        o.customer,
        o.email,
        o.amount,
        o.status,
        o.delivery,
        o.createdAt,
      ]),
    );
  }
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
