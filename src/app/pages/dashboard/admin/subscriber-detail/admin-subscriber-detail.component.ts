import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { EmptyStateComponent } from '../../../../shared/components/common/empty-state/empty-state.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../../shared/components/ui/table/table-cell.component';
import { InrPaisePipe } from '../../../../shared/pipe/inr-paise.pipe';
import {
  AdminService,
  AdminSubscriberDetail,
  AdminUsageLogRow,
  AdminUsageMeter,
} from '../../../../shared/services/admin.service';
import { AdminPaginationComponent } from '../shared/admin-pagination.component';

@Component({
  selector: 'app-admin-subscriber-detail',
  imports: [
    CommonModule,
    RouterModule,
    PageBreadcrumbComponent,
    EmptyStateComponent,
    BadgeComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
    InrPaisePipe,
    AdminPaginationComponent,
  ],
  templateUrl: './admin-subscriber-detail.component.html',
})
export class AdminSubscriberDetailComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  subscriberId = '';
  detail: AdminSubscriberDetail | null = null;
  notFound = false;

  logs: AdminUsageLogRow[] = [];
  logsPage = 1;
  readonly logsPageSize = 20;
  logsTotal = 0;

  readonly icons = {
    revenue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12M6 8h12M9 4c4 0 5 8-3 8l6 8"/></svg>`,
    gmv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/></svg>`,
  };

  ngOnInit(): void {
    this.subscriberId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.subscriberId) {
      this.notFound = true;
      return;
    }
    this.admin.getSubscriberDetail(this.subscriberId).subscribe({
      next: (detail) => (this.detail = detail),
      error: () => (this.notFound = true),
    });
    this.loadLogs();
  }

  setLogsPage(page: number): void {
    this.logsPage = page;
    this.loadLogs();
  }

  meterPercent(meter: AdminUsageMeter): number {
    if (meter.limit === null || meter.limit === 0) return 0;
    return Math.min(100, Math.round((meter.used / meter.limit) * 100));
  }

  meterLabel(meter: AdminUsageMeter): string {
    return `${meter.used} / ${meter.limit ?? 'Unlimited'}`;
  }

  planBadge(): { label: string; color: 'success' | 'info' | 'light' } {
    const d = this.detail;
    if (!d) return { label: '—', color: 'light' };
    if (d.tier) return { label: d.tier, color: 'success' };
    if (d.access.isTrialing) {
      return { label: `Trial · ${d.access.trialDaysLeft}d left`, color: 'info' };
    }
    return { label: 'No plan', color: 'light' };
  }

  paymentColor(status: 'CREATED' | 'PAID' | 'FAILED'): 'success' | 'warning' | 'error' {
    if (status === 'PAID') return 'success';
    if (status === 'CREATED') return 'warning';
    return 'error';
  }

  // ── Subscriber 360° hero helpers (derive from real data only) ──────────
  /** Two-letter avatar initials from name, else the email. */
  get initials(): string {
    const d = this.detail;
    if (!d) return '—';
    const src = (d.name || d.email || '').trim();
    const parts = src.split(/[\s@.]+/).filter(Boolean);
    return (
      ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || src[0]?.toUpperCase() || '?'
    );
  }

  /** Server-truth account status pill (no fabricated "health score"). */
  get statusPill(): { label: string; cls: string } {
    const d = this.detail;
    if (!d) return { label: '—', cls: 'border-white/30 bg-white/15 text-white' };
    if (d.tier)
      return { label: 'Active · paid', cls: 'border-[#7fd1a2]/50 bg-[#7fd1a2]/25 text-white' };
    if (d.access.isTrialing)
      return { label: 'On trial', cls: 'border-white/30 bg-[#f7c66b]/25 text-white' };
    return { label: 'No plan', cls: 'border-white/30 bg-white/15 text-white/80' };
  }

  /** First connected Instagram handle, if any. */
  get handle(): string | null {
    return this.detail?.igAccounts[0]?.username ?? null;
  }

  /** MRR in paise, derived from the current paid tier (0 while on trial/none). */
  get mrrPaise(): number {
    switch (this.detail?.tier) {
      case 'PRO':
        return 149900;
      case 'BUSINESS':
        return 399900;
      default:
        return 0;
    }
  }

  /** Whole months since signup (for the "Months active" stat). */
  get monthsActive(): number {
    if (!this.detail) return 0;
    const start = new Date(this.detail.createdAt).getTime();
    if (Number.isNaN(start)) return 0;
    const months = (Date.now() - start) / (1000 * 60 * 60 * 24 * 30.44);
    return Math.max(0, Math.floor(months));
  }

  /** 30-day request volume (real: AI actions used this cycle). */
  get requests30d(): number {
    return this.detail?.usage.ai.used ?? 0;
  }

  private loadLogs(): void {
    if (!this.subscriberId) return;
    this.admin.getSubscriberLogs(this.subscriberId, this.logsPage, this.logsPageSize).subscribe({
      next: (res) => {
        this.logs = res.items;
        this.logsTotal = res.total;
      },
      error: () => {
        this.logs = [];
        this.logsTotal = 0;
      },
    });
  }
}
