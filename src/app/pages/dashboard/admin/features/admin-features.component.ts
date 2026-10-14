import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../../shared/components/common/page-header/page-header.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { StatCardComponent } from '../../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../../shared/components/common/empty-state/empty-state.component';
import { BarChartOneComponent } from '../../../../shared/components/charts/bar/bar-chart-one/bar-chart-one.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../../shared/components/ui/table/table-cell.component';
import {
  AdminFeatureBoard,
  AdminRange,
  AdminService,
} from '../../../../shared/services/admin.service';

interface RangeOption {
  value: AdminRange;
  label: string;
}

@Component({
  selector: 'app-admin-features',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    ComponentCardComponent,
    StatCardComponent,
    EmptyStateComponent,
    BarChartOneComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
  ],
  templateUrl: './admin-features.component.html',
})
export class AdminFeaturesComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  board: AdminFeatureBoard | null = null;
  range: AdminRange = '30d';
  accountId = ''; // optional filter arriving via ?accountId=
  loading = false;

  categories: string[] = [];
  series: ApexAxisChartSeries = [];

  readonly ranges: RangeOption[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ];

  readonly icons = {
    uses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-6"/></svg>`,
    features: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>`,
  };

  // ── Real-data KPIs (aggregated over the loaded leaderboard) ─────────────
  get totalUses(): number {
    return (this.board?.items ?? []).reduce((a, i) => a + i.count, 0);
  }
  get activeFeatures(): number {
    return this.board?.items.length ?? 0;
  }
  get platformErrorRatePct(): number {
    const errors = (this.board?.items ?? []).reduce((a, i) => a + i.errorCount, 0);
    return this.totalUses ? (errors / this.totalUses) * 100 : 0;
  }
  /** Count-weighted average latency across features that report a duration. */
  get avgLatencyMs(): number {
    const items = (this.board?.items ?? []).filter((i) => i.avgDurationMs !== null);
    const totalCount = items.reduce((a, i) => a + i.count, 0);
    if (!totalCount) return 0;
    const weighted = items.reduce((a, i) => a + (i.avgDurationMs ?? 0) * i.count, 0);
    return weighted / totalCount;
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const range = params.get('range') as AdminRange | null;
    if (range === '7d' || range === '30d' || range === '90d') this.range = range;
    this.accountId = params.get('accountId') ?? '';
    this.load();
  }

  setRange(range: AdminRange): void {
    if (range === this.range) return;
    this.range = range;
    this.load();
  }

  clearAccountFilter(): void {
    this.accountId = '';
    this.load();
  }

  private load(): void {
    this.loading = true;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { range: this.range, accountId: this.accountId || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.admin.getFeatureBoard(this.range, this.accountId || undefined).subscribe({
      next: (board) => {
        this.board = board;
        const top10 = board.items.slice(0, 10);
        this.categories = top10.map((i) => i.feature);
        this.series = [{ name: 'Uses', data: top10.map((i) => i.count) }];
        this.loading = false;
      },
      error: () => {
        this.board = null;
        this.loading = false;
      },
    });
  }
}
