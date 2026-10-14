import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { Order, OrderStatus, SalesService } from './sales.service';
import { downloadCsv } from '../../../shared/utils/csv.util';

const PAGE_SIZE = 8;
const MOBILE_PREVIEW = 6;

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    ButtonComponent,
    BadgeComponent,
    SelectComponent,
  ],
  templateUrl: './sales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent implements OnInit {
  private readonly sales = inject(SalesService);
  readonly orders$ = this.sales.orders$;

  ngOnInit(): void {
    this.sales.load().subscribe({ error: () => undefined });
  }

  search = '';
  statusFilter = 'all';
  page = 1;
  /** Mobile stacked-card list shows a preview, expanded by "View all N orders →". */
  mobileExpanded = false;

  readonly pageSize = PAGE_SIZE;
  readonly mobilePreview = MOBILE_PREVIEW;

  readonly statusOptions: Option[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  /** Mobile filter pills (same choices as the select). */
  readonly statusChips = this.statusOptions.map((o) => ({
    value: o.value,
    label: o.value === 'all' ? 'All' : o.label,
  }));

  readonly icons = {
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 8H6"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4 12 14.01l-3-3"/></svg>`,
  };

  onSearchChange(value: string): void {
    this.search = value;
    this.page = 1;
  }

  onStatusChange(value: string): void {
    this.statusFilter = value;
    this.page = 1;
  }

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

  /** Current page slice for the desktop/tablet table. */
  paged(rows: Order[]): Order[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }

  totalPages(rows: Order[]): number {
    return Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  }

  /** Page numbers for the pager (all pages; lists stay small client-side). */
  pages(rows: Order[]): number[] {
    return Array.from({ length: this.totalPages(rows) }, (_, i) => i + 1);
  }

  setPage(p: number, rows: Order[]): void {
    this.page = Math.min(Math.max(1, p), this.totalPages(rows));
  }

  /** Mobile card list (preview → all). */
  mobileRows(rows: Order[]): Order[] {
    return this.mobileExpanded ? rows : rows.slice(0, MOBILE_PREVIEW);
  }

  count(orders: Order[], status: OrderStatus): number {
    return orders.filter((o) => o.status === status).length;
  }

  /** Orders created in the trailing 7 days (the "+N this week" delta). */
  weekDelta(orders: Order[]): number {
    const weekAgo = Date.now() - 7 * 86_400_000;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= weekAgo).length;
  }

  /** Completed share of all orders (the "95%" pill). */
  completedPct(orders: Order[]): string {
    if (!orders.length) return '0%';
    return `${Math.round((this.count(orders, 'paid') / orders.length) * 100)}%`;
  }

  revenue(orders: Order[]): string {
    const total = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0);
    return formatMoney(total, orders[0]?.currency ?? 'INR');
  }

  money(amount: number, currency: string): string {
    return formatMoney(amount, currency);
  }

  statusColor(status: OrderStatus): 'success' | 'info' | 'error' | 'light' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'info'; // Aurora: Pending pill is blue, not amber
      case 'failed':
        return 'error';
      case 'refunded':
        return 'light';
    }
  }

  initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
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
