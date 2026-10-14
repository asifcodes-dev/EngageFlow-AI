import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { LineChartOneComponent } from '../../../shared/components/charts/line/line-chart-one/line-chart-one.component';
import { BarChartOneComponent } from '../../../shared/components/charts/bar/bar-chart-one/bar-chart-one.component';
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

/** Solid graded-blue fills by rank (reference artboard top-products bars). */
const RANK_FILLS = ['#1a5dab', '#4a7fbd', '#8fb4dd', '#c8daf0'];

@Component({
  selector: 'app-insights',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    EmptyStateComponent,
    LineChartOneComponent,
    BarChartOneComponent,
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
    reply: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.4A8.4 8.4 0 1 1 21 11.5Z"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M12 2v20"/><path d="m19 9-7-7-7 7"/></svg>`,
    spam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
    flows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h13"/></svg>`,
    catalog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M21 8v13H3V8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
    actions: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>`,
  };

  /** Replies + DMs + moderation — the total work done ("Automated actions"). */
  get automatedActions(): number {
    return (
      this.totals.commentReplies +
      this.totals.dmsSent +
      this.totals.spamDeleted +
      this.totals.abuseDeleted
    );
  }

  ngOnInit(): void {
    this.load();
  }

  setRange(value: AnalyticsRange): void {
    if (value === this.range) return;
    this.range = value;
    this.load();
  }

  /** Rank numeral fill + bar color for the top-products list. */
  rankFill(index: number): string {
    return RANK_FILLS[Math.min(index, RANK_FILLS.length - 1)];
  }

  asks(p: TopProduct): number {
    return p.leads + p.replies;
  }

  /** Bar width relative to the top product. */
  barWidth(p: TopProduct): number {
    const max = Math.max(...this.topProducts.map((t) => this.asks(t)), 1);
    return Math.max(4, Math.round((this.asks(p) / max) * 100));
  }

  private load(): void {
    this.loading = true;
    this.analytics.getSummary(this.range).subscribe({
      next: (s) => {
        this.totals = s.totals;
        this.categories = s.series.categories;
        this.lineSeries = [
          { name: 'Replies', data: s.series.commentReplies },
          { name: 'Actions', data: s.series.actions },
        ];
        this.barSeries = [{ name: 'Actions', data: s.series.actions }];
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
