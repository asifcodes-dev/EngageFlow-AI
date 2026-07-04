import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../../shared/components/common/page-header/page-header.component';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
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
