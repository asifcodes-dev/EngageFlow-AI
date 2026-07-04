import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { LineChartOneComponent } from '../../../shared/components/charts/line/line-chart-one/line-chart-one.component';
import { BarChartOneComponent } from '../../../shared/components/charts/bar/bar-chart-one/bar-chart-one.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';
import {
  AnalyticsRange,
  AnalyticsService,
  AnalyticsSummary,
  TopProduct,
} from '../../../shared/services/analytics.service';

interface RangeOption {
  value: AnalyticsRange;
  label: string;
}

@Component({
  selector: 'app-insights',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    ComponentCardComponent,
    EmptyStateComponent,
    LineChartOneComponent,
    BarChartOneComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
  ],
  templateUrl: './insights.component.html',
})
export class InsightsComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  range: AnalyticsRange = '30d';
  loading = false;

  totals: AnalyticsSummary['totals'] = {
    dmsSent: 0,
    commentReplies: 0,
    leadsCaptured: 0,
    sales: 0,
    spamDeleted: 0,
    abuseDeleted: 0,
    followersGained: 0,
    contacts: 0,
    activeFlows: 0,
    catalogSize: 0,
  };
  categories: string[] = [];
  lineSeries: ApexAxisChartSeries = [];
  barSeries: ApexAxisChartSeries = [];
  topProducts: TopProduct[] = [];

  readonly ranges: RangeOption[] = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
  ];

  readonly icons = {
    reply: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v1M13 21l4-4-4-4M17 17H9"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 0a2 2 0 1 1 6 0"/></svg>`,
    spam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6l-8-3Z"/></svg>`,
    flows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3v12a3 3 0 0 0 3 3h6M6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`,
    catalog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7"/></svg>`,
    actions: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>`,
  };

  /** Replies + spam/abuse handled — total work the automations did this window. */
  get automatedActions(): number {
    return this.totals.commentReplies + this.totals.spamDeleted;
  }

  ngOnInit(): void {
    this.load();
  }

  setRange(value: AnalyticsRange): void {
    if (value === this.range) return;
    this.range = value;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.analytics.getSummary(this.range).subscribe({
      next: (s) => {
        this.totals = s.totals;
        this.categories = s.series.categories;
        this.lineSeries = [
          { name: 'Comment replies', data: s.series.commentReplies },
          { name: 'Automated actions', data: s.series.actions },
        ];
        this.barSeries = [{ name: 'Automated actions', data: s.series.actions }];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
    this.analytics.getTopProducts(this.range).subscribe({
      next: (p) => (this.topProducts = p),
      error: () => (this.topProducts = []),
    });
  }
}
