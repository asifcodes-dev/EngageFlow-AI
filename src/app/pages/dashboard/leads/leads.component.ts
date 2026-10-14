import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { FeatureLockComponent } from '../../../shared/components/ui/feature-lock/feature-lock.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { Lead, LeadsService } from './leads.service';
import { downloadCsv } from '../../../shared/utils/csv.util';

@Component({
  selector: 'app-leads',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    FeatureLockComponent,
    ButtonComponent,
  ],
  templateUrl: './leads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent implements OnInit {
  private readonly connection = inject(ConnectionStateService);
  private readonly leadsService = inject(LeadsService);

  readonly connected$ = this.connection.connected$;
  readonly username$ = this.connection.username$;
  readonly leads$ = this.leadsService.leads$;

  // Lead-magnet form builder (persists to backend later — deliberate local stub).
  formTitle = 'Get my free guide';
  collectPhone = false;
  collectGoal = true;
  saved = false;

  ngOnInit(): void {
    this.leadsService.load().subscribe({
      error: () => {
        /* keep leads$ empty; the page shows its own empty state */
      },
    });
  }

  saveForm(): void {
    this.saved = true;
  }

  initials(name: string | null): string {
    if (!name) return '·';
    return name
      .trim()
      .split(/[\s._-]+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  export(leads: Lead[]): void {
    downloadCsv(
      'leads.csv',
      ['Username', 'Asked about', 'Comment', 'Captured'],
      leads.map((l) => [l.username ?? '', l.productName ?? '', l.text ?? '', l.capturedAt]),
    );
  }
}
