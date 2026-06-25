import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
import { FeatureLockComponent } from '../../../shared/components/ui/feature-lock/feature-lock.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { AudienceService, Contact } from './audience.service';
import { downloadCsv } from '../../../shared/utils/csv.util';

@Component({
  selector: 'app-audience',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    FeatureLockComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
    InputFieldComponent,
  ],
  templateUrl: './audience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudienceComponent {
  private readonly connection = inject(ConnectionStateService);
  private readonly audience = inject(AudienceService);

  readonly connected$ = this.connection.connected$;
  readonly contacts$ = this.audience.contacts$;

  search = '';
  selected: Contact | null = null;

  filtered(contacts: Contact[]): Contact[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  open(contact: Contact): void {
    this.selected = contact;
  }

  close(): void {
    this.selected = null;
  }

  export(contacts: Contact[]): void {
    downloadCsv(
      'contacts.csv',
      ['Name', 'Handle', 'Email', 'Tags', 'Last active', 'Source'],
      contacts.map((c) => [c.name, c.handle, c.email, c.tags.join('; '), c.lastActive, c.source]),
    );
  }
}
