import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
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
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { ProductService } from '../product-catalog/product.service';
import { Flow, FlowService, FlowTrigger } from './flow.service';

interface FlowForm {
  name: string;
  // string (not FlowTrigger) so the two-way select binding type-checks; cast on save.
  trigger: string;
  keyword: string;
  product: string;
  followGate: boolean;
}

@Component({
  selector: 'app-flows',
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
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    CheckboxComponent,
  ],
  templateUrl: './flows.component.html',
})
export class FlowsComponent {
  private readonly connection = inject(ConnectionStateService);
  private readonly flowService = inject(FlowService);
  private readonly productService = inject(ProductService);

  readonly connected$ = this.connection.connected$;
  readonly flows$ = this.flowService.flows$;

  readonly triggerOptions: Option[] = [
    { value: 'comment', label: 'Comment on a post' },
    { value: 'dm', label: 'Direct message' },
    { value: 'story_reply', label: 'Story reply' },
  ];

  readonly productOptions$ = this.productService.products$.pipe(
    map((products): Option[] => [
      { value: '', label: 'No product (just reply)' },
      ...products.map((p) => ({ value: p.name, label: p.name })),
    ]),
  );

  isModalOpen = false;
  submitted = false;
  saving = false;
  form: FlowForm = emptyForm();

  readonly triggerLabels: Record<FlowTrigger, string> = {
    comment: 'Comment',
    dm: 'Direct message',
    story_reply: 'Story reply',
  };

  get nameError(): string {
    if (!this.submitted) return '';
    return this.form.name.trim() ? '' : 'Give your flow a name.';
  }

  openCreate(): void {
    this.form = emptyForm();
    this.submitted = false;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.submitted = false;
  }

  save(): void {
    this.submitted = true;
    if (this.nameError) return;
    this.saving = true;
    this.flowService
      .create({
        name: this.form.name.trim(),
        trigger: this.form.trigger as FlowTrigger,
        keyword: this.form.keyword.trim(),
        product: this.form.product,
        followGate: this.form.followGate,
        status: 'active',
      })
      .subscribe(() => {
        this.saving = false;
        this.closeModal();
      });
  }

  toggle(flow: Flow): void {
    this.flowService.toggle(flow.id);
  }

  remove(flow: Flow): void {
    this.flowService.remove(flow.id);
  }
}

function emptyForm(): FlowForm {
  return { name: '', trigger: 'comment', keyword: '', product: '', followGate: false };
}
