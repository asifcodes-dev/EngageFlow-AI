import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { FeatureLockComponent } from '../../../shared/components/ui/feature-lock/feature-lock.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { CommentCategory, CommentGuardService } from './comment-guard.service';

@Component({
  selector: 'app-comment-guard',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    FeatureLockComponent,
    BadgeComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
    CheckboxComponent,
  ],
  templateUrl: './comment-guard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentGuardComponent implements OnInit {
  private readonly connection = inject(ConnectionStateService);
  private readonly guard = inject(CommentGuardService);
  private readonly analytics = inject(AnalyticsService);

  readonly connected$ = this.connection.connected$;
  readonly comments$ = this.guard.comments$;
  /** KPI totals from the real analytics summary (0 until events accrue). */
  readonly summary$ = this.analytics.getSummary('30d').pipe(catchError(() => of(null)));

  // Auto-moderation settings (local for now; persists to the backend later).
  autoHideSpam = true;
  autoDeleteAbuse = true;
  notifyOnAbuse = false;

  readonly statIcons = {
    spam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6l-8-3Z"/></svg>`,
    abuse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>`,
    reviewed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    auto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>`,
  };

  readonly categoryLabels: Record<CommentCategory, string> = {
    genuine: 'Genuine',
    inquiry: 'Inquiry',
    spam: 'Spam',
    abuse: 'Abuse',
  };

  ngOnInit(): void {
    this.guard.load().subscribe({ error: () => undefined });
  }

  categoryColor(category: CommentCategory): 'success' | 'info' | 'warning' | 'error' {
    switch (category) {
      case 'genuine':
        return 'success';
      case 'inquiry':
        return 'info';
      case 'spam':
        return 'warning';
      case 'abuse':
        return 'error';
    }
  }
}
