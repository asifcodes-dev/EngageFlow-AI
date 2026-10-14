import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../../shared/components/common/page-header/page-header.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { StatCardComponent } from '../../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../../shared/components/common/empty-state/empty-state.component';
import { LineChartOneComponent } from '../../../../shared/components/charts/line/line-chart-one/line-chart-one.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../../shared/components/ui/table/table-cell.component';
import {
  AdminIgAccount,
  AdminRange,
  AdminService,
  AdminSubscriberRow,
  AdminUsageSeries,
} from '../../../../shared/services/admin.service';

interface RangeOption {
  value: AdminRange;
  label: string;
}

@Component({
  selector: 'app-admin-usage',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    ComponentCardComponent,
    StatCardComponent,
    EmptyStateComponent,
    LineChartOneComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
  ],
  templateUrl: './admin-usage.component.html',
})
export class AdminUsageComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pickerInput$ = new Subject<string>();

  // Subscriber picker
  pickerQuery = '';
  pickerResults: AdminSubscriberRow[] = [];
  selectedUser: AdminSubscriberRow | null = null;

  // Account + range filters
  accounts: AdminIgAccount[] = [];
  accountId = ''; // '' = all accounts
  range: AdminRange = '30d';

  // Chart + breakdown
  usage: AdminUsageSeries | null = null;
  categories: string[] = [];
  series: ApexAxisChartSeries = [];
  loading = false;

  readonly ranges: RangeOption[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ];

  readonly icons = {
    requests: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-6"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>`,
    feature: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>`,
    chartLine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>`,
  };

  // ── Real-data KPIs (sums over the selected window; no fabrication) ──────
  get totalRequests(): number {
    return (this.usage?.series.total ?? []).reduce((a, b) => a + b, 0);
  }
  get totalErrors(): number {
    return (this.usage?.series.errors ?? []).reduce((a, b) => a + b, 0);
  }
  get errorRatePct(): number {
    return this.totalRequests ? (this.totalErrors / this.totalRequests) * 100 : 0;
  }
  get featuresUsed(): number {
    return this.usage?.byFeature.length ?? 0;
  }

  constructor() {
    this.pickerInput$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.searchSubscribers(value));
  }

  ngOnInit(): void {
    // Deep-link support: /dashboard/admin/usage?userId=&accountId=&range=
    const params = this.route.snapshot.queryParamMap;
    const range = params.get('range') as AdminRange | null;
    if (range === '7d' || range === '30d' || range === '90d') this.range = range;
    this.accountId = params.get('accountId') ?? '';
    const userId = params.get('userId');
    if (userId) this.selectUserById(userId);
  }

  onPickerInput(value: string): void {
    this.pickerQuery = value;
    this.pickerInput$.next(value);
  }

  pickUser(user: AdminSubscriberRow): void {
    this.selectedUser = user;
    this.pickerResults = [];
    this.pickerQuery = user.email;
    this.accountId = '';
    this.loadAccounts();
    this.loadUsage();
  }

  setAccount(accountId: string): void {
    this.accountId = accountId;
    this.loadUsage();
  }

  setRange(range: AdminRange): void {
    if (range === this.range) return;
    this.range = range;
    this.loadUsage();
  }

  private searchSubscribers(query: string): void {
    if (!query.trim()) {
      this.pickerResults = [];
      return;
    }
    this.admin.getSubscribers({ search: query, page: 1, pageSize: 8 }).subscribe({
      next: (res) => (this.pickerResults = res.items),
      error: () => (this.pickerResults = []),
    });
  }

  private selectUserById(userId: string): void {
    // Resolve the deep-linked user via the detail endpoint (single lookup).
    this.admin.getSubscriberDetail(userId).subscribe({
      next: (d) => {
        this.selectedUser = {
          id: d.id,
          email: d.email,
          name: d.name,
          tier: d.tier,
          effectiveTier: d.access.effectiveTier,
          isTrialing: d.access.isTrialing,
          trialDaysLeft: d.access.trialDaysLeft,
          igAccounts: d.igAccounts.length,
          flows: d.usage.flows.used,
          products: d.usage.products.used,
          revenuePaise: d.revenuePaise,
          gmvPaise: d.gmvPaise,
          createdAt: d.createdAt,
        };
        this.pickerQuery = d.email;
        this.accounts = d.igAccounts;
        this.loadUsage();
      },
      error: () => (this.selectedUser = null),
    });
  }

  private loadAccounts(): void {
    if (!this.selectedUser) return;
    this.admin.getSubscriberAccounts(this.selectedUser.id).subscribe({
      next: (accounts) => (this.accounts = accounts),
      error: () => (this.accounts = []),
    });
  }

  private loadUsage(): void {
    if (!this.selectedUser) return;
    this.loading = true;
    // Keep the URL shareable.
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        userId: this.selectedUser.id,
        accountId: this.accountId || null,
        range: this.range,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.admin
      .getSubscriberUsage(this.selectedUser.id, this.range, this.accountId || undefined)
      .subscribe({
        next: (usage) => {
          this.usage = usage;
          this.categories = usage.series.categories;
          this.series = [
            { name: 'Requests', data: usage.series.total },
            { name: 'Errors', data: usage.series.errors },
          ];
          this.loading = false;
        },
        error: () => {
          this.usage = null;
          this.loading = false;
        },
      });
  }
}
