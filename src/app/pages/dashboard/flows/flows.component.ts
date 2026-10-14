import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { AiService } from '../../../shared/services/ai.service';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { Product } from '../product-catalog/product.model';
import { ProductService } from '../product-catalog/product.service';
import { Flow, FlowScope, FlowService, FlowTrigger } from './flow.service';

interface FlowForm {
  name: string;
  // strings (not the union types) so the two-way select bindings type-check; cast on save.
  trigger: string;
  keyword: string;
  productId: string;
  scope: string;
  // Free-text post IDs (whitespace/comma separated); parsed on save.
  postIds: string;
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
export class FlowsComponent implements OnInit {
  private readonly connection = inject(ConnectionStateService);
  private readonly flowService = inject(FlowService);
  private readonly productService = inject(ProductService);
  private readonly ai = inject(AiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly connected$ = this.connection.connected$;
  readonly flows$ = this.flowService.flows$;

  /** Snapshot of the catalog, used to resolve the selected product for preview. */
  private products: Product[] = [];

  readonly triggerOptions: Option[] = [
    { value: 'comment', label: 'Comment on a post (fires now)' },
    { value: 'dm', label: 'Direct message (requires DM access)' },
    { value: 'story_reply', label: 'Story reply (requires DM access)' },
  ];

  readonly scopeOptions: Option[] = [
    { value: 'all', label: 'All posts' },
    { value: 'specific', label: 'Specific post(s)' },
  ];

  readonly productOptions$ = this.productService.products$.pipe(
    map((products): Option[] => [
      { value: '', label: 'No product (just reply)' },
      ...products.map((p) => ({ value: p.id, label: p.name })),
    ]),
  );

  isModalOpen = false;
  submitted = false;
  saving = false;
  /** Backend error (e.g. plan flow-limit reached) shown in the create modal. */
  saveError = '';
  form: FlowForm = emptyForm();

  // Live AI reply preview state.
  previewing = false;
  previewText = '';

  readonly triggerLabels: Record<FlowTrigger, string> = {
    comment: 'Comment',
    dm: 'Direct message',
    story_reply: 'Story reply',
  };

  ngOnInit(): void {
    this.flowService.load().subscribe({ error: () => undefined });
    this.productService.ensureLoaded();
    this.productService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => (this.products = products));
  }

  get nameError(): string {
    if (!this.submitted) return '';
    return this.form.name.trim() ? '' : 'Give your flow a name.';
  }

  openCreate(): void {
    this.form = emptyForm();
    this.submitted = false;
    this.previewText = '';
    this.saveError = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.submitted = false;
    this.previewText = '';
    this.saveError = '';
  }

  /** Generate a sample reply with the linked product so the user sees the AI voice. */
  preview(): void {
    this.previewing = true;
    this.previewText = '';
    const product = this.products.find((p) => p.id === this.form.productId) ?? null;
    this.ai
      .generateReply({
        businessName: 'Your business',
        comment: this.sampleComment(),
        productName: product?.name,
        productDescription: product?.description,
        price: product?.price,
        currency: product?.currency,
      })
      .subscribe({
        next: (res) => {
          this.previewText = res.reply;
          this.previewing = false;
        },
        error: () => {
          this.previewText = 'Could not generate a preview right now. Try again.';
          this.previewing = false;
        },
      });
  }

  save(): void {
    this.submitted = true;
    if (this.nameError) return;
    this.saving = true;
    this.saveError = '';
    this.flowService
      .create({
        name: this.form.name.trim(),
        trigger: this.form.trigger as FlowTrigger,
        keyword: this.form.keyword.trim(),
        productId: this.form.productId || null,
        scope: this.form.scope as FlowScope,
        postIds: parsePostIds(this.form.postIds),
        followGate: this.form.followGate,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
        },
        error: (err: unknown) => {
          this.saving = false;
          // Surface backend messages (e.g. plan flow-limit reached → 409).
          this.saveError = extractHttpMessage(err, 'Could not create the flow. Please try again.');
        },
      });
  }

  toggle(flow: Flow): void {
    this.flowService.toggle(flow).subscribe({ error: () => undefined });
  }

  remove(flow: Flow): void {
    this.flowService.remove(flow).subscribe({ error: () => undefined });
  }

  private sampleComment(): string {
    const first = this.form.keyword.split(',')[0]?.trim();
    return first ? `Hi! ${first}?` : 'Hi, is this available? How much?';
  }
}

function emptyForm(): FlowForm {
  return {
    name: '',
    trigger: 'comment',
    keyword: '',
    productId: '',
    scope: 'all',
    postIds: '',
    followGate: false,
  };
}

function parsePostIds(s: string): string[] {
  return s
    .split(/[\s,]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Pull a human-readable message out of an HTTP error, with a fallback. */
function extractHttpMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const m = err.error?.message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m) && typeof m[0] === 'string') return m[0];
  }
  return fallback;
}
