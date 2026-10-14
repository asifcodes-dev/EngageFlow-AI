import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../../shared/components/common/page-header/page-header.component';
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
  AdminOverview,
  AdminService,
  AdminSubscriberRow,
  SubscriberSort,
} from '../../../../shared/services/admin.service';
import { AdminPaginationComponent } from '../shared/admin-pagination.component';

@Component({
  selector: 'app-admin-subscribers',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
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
  templateUrl: './admin-subscribers.component.html',
})
export class AdminSubscribersComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly searchInput$ = new Subject<string>();

  overview: AdminOverview | null = null;
  rows: AdminSubscriberRow[] = [];
  loading = false;

  page = 1;
  readonly pageSize = 20;
  total = 0;
  search = '';
  planFilter: 'all' | 'Pro' | 'Max' | 'Trial' | 'Locked' = 'all';
  sort: SubscriberSort = 'createdAt';
  dir: 'asc' | 'desc' = 'desc';

  readonly icons = {
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 8v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>`,
    trial: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    paying: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="m3 7 4 4 5-6 5 6 4-4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"/></svg>`,
    revenue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12M6 8h12M9 4c4 0 5 8-3 8l6 8"/></svg>`,
    requests: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2.5-7 5 14 2.5-7h4"/></svg>`,
  };

  constructor() {
    // takeUntilDestroyed() requires an injection context → wire it here.
    this.searchInput$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.search = value;
        this.page = 1;
        this.load();
      });
  }

  ngOnInit(): void {
    this.admin.getOverview().subscribe({
      next: (o) => (this.overview = o),
      error: () => (this.overview = null),
    });
    this.load();
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPlanFilter(value: 'all' | 'Pro' | 'Max' | 'Trial' | 'Locked'): void {
    this.planFilter = value;
  }

  /** Rows visible after the client-side plan filter (backend paginates/searches; plan is local). */
  get displayRows(): AdminSubscriberRow[] {
    if (this.planFilter === 'all') return this.rows;
    return this.rows.filter((row) => this.planCategory(row) === this.planFilter);
  }

  /** Initials chip source: first letters of the name, else the first two of the email. */
  initials(row: AdminSubscriberRow): string {
    const source = (row.name || row.email || '').trim();
    if (!source) return '—';
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return source.slice(0, 2).toUpperCase();
  }

  private planCategory(row: AdminSubscriberRow): 'Pro' | 'Max' | 'Trial' | 'Locked' {
    if (row.tier === 'PRO') return 'Pro';
    if (row.tier) return 'Max';
    if (row.isTrialing) return 'Trial';
    return 'Locked';
  }

  setSort(column: SubscriberSort): void {
    if (this.sort === column) {
      this.dir = this.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = column;
      this.dir = 'desc';
    }
    this.page = 1;
    this.load();
  }

  setPage(page: number): void {
    this.page = page;
    this.load();
  }

  tierBadge(row: AdminSubscriberRow): {
    label: string;
    color: 'success' | 'info' | 'warning' | 'light';
  } {
    // Handoff plan-pill palette: Pro green · Max blue · Trial amber · none grey.
    if (row.tier === 'PRO') return { label: 'Pro', color: 'success' };
    if (row.tier) return { label: 'Max', color: 'info' };
    if (row.isTrialing) return { label: `Trial · ${row.trialDaysLeft}d`, color: 'warning' };
    return { label: 'Locked', color: 'light' };
  }

  private load(): void {
    this.loading = true;
    this.admin
      .getSubscribers({
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        sort: this.sort,
        dir: this.dir,
      })
      .subscribe({
        next: (res) => {
          this.rows = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.rows = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }
}
