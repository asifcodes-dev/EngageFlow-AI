import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { StatCardComponent } from '../../../../shared/components/common/stat-card/stat-card.component';
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
    ComponentCardComponent,
    StatCardComponent,
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

  private loadLogs(): void {
    if (!this.subscriberId) return;
    this.admin
      .getSubscriberLogs(this.subscriberId, this.logsPage, this.logsPageSize)
      .subscribe({
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
