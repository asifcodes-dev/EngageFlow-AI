import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LineChartOneComponent } from '../../../shared/components/charts/line/line-chart-one/line-chart-one.component';
import { BarChartOneComponent } from '../../../shared/components/charts/bar/bar-chart-one/bar-chart-one.component';

interface RangeOption {
  value: string;
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
    LineChartOneComponent,
    BarChartOneComponent,
  ],
  templateUrl: './insights.component.html',
})
export class InsightsComponent {
  range = '30d';

  readonly ranges: RangeOption[] = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
  ];

  readonly icons = {
    dm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/></svg>`,
    reply: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v1M13 21l4-4-4-4M17 17H9"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 0a2 2 0 1 1 6 0"/></svg>`,
    sales: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/></svg>`,
    spam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6l-8-3Z"/></svg>`,
    followers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-2v6m3-3h-6"/></svg>`,
  };

  setRange(value: string): void {
    this.range = value;
  }
}
