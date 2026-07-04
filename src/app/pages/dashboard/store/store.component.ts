import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../../shared/components/common/empty-state/empty-state.component';
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
import { FileInputComponent } from '../../../shared/components/form/input/file-input.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { DigitalProduct, ProductType, StoreService } from './store.service';
import { StoreSettingsComponent } from './store-settings.component';
import { StoreCategoriesComponent } from './store-categories.component';

interface StoreForm {
  title: string;
  // string (not ProductType) so the two-way select binding type-checks; cast on save.
  type: string;
  price: string;
  currency: string;
  fileName: string;
  downloadUrl: string;
  active: boolean;
}

@Component({
  selector: 'app-store',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    StatCardComponent,
    EmptyStateComponent,
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
    FileInputComponent,
    CheckboxComponent,
    StoreSettingsComponent,
    StoreCategoriesComponent,
  ],
  templateUrl: './store.component.html',
})
export class StoreComponent implements OnInit {
  private readonly store = inject(StoreService);
  readonly products$ = this.store.products$;

  readonly tabs = [
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'settings', label: 'Store Settings' },
  ] as const;
  activeTab: 'products' | 'categories' | 'settings' = 'products';

  ngOnInit(): void {
    this.store.load().subscribe({ error: () => undefined });
  }

  readonly typeOptions: Option[] = [
    { value: 'ebook', label: 'eBook / PDF' },
    { value: 'course', label: 'Course' },
    { value: 'template', label: 'Template' },
    { value: 'bundle', label: 'Bundle' },
  ];
  readonly currencyOptions: Option[] = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];
  readonly typeLabels: Record<ProductType, string> = {
    ebook: 'eBook',
    course: 'Course',
    template: 'Template',
    bundle: 'Bundle',
  };

  readonly icons = {
    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 16-9 5-9-5V8l9-5 9 5v8ZM3 8l9 5 9-5M12 13v8"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    rupee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12M6 8h12M9 4c4 0 5 8-3 8l6 8"/></svg>`,
  };

  isModalOpen = false;
  submitted = false;
  saving = false;
  form: StoreForm = emptyForm();

  get titleError(): string {
    if (!this.submitted) return '';
    return this.form.title.trim() ? '' : 'Product title is required.';
  }

  get priceError(): string {
    if (!this.submitted) return '';
    const value = Number(this.form.price);
    if (!this.form.price.trim() || !Number.isFinite(value) || value < 0)
      return 'Enter a valid price.';
    return '';
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

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.fileName = input.files?.[0]?.name ?? '';
  }

  save(): void {
    this.submitted = true;
    if (this.titleError || this.priceError) return;
    this.saving = true;
    this.store
      .create({
        title: this.form.title.trim(),
        type: this.form.type as ProductType,
        price: Number(this.form.price),
        currency: this.form.currency,
        fileName: this.form.fileName || 'file.pdf',
        downloadUrl: this.form.downloadUrl.trim() || undefined,
        status: this.form.active ? 'active' : 'draft',
      })
      .subscribe(() => {
        this.saving = false;
        this.closeModal();
      });
  }

  toggle(product: DigitalProduct): void {
    this.store.toggleStatus(product).subscribe({ error: () => undefined });
  }

  remove(product: DigitalProduct): void {
    this.store.remove(product.id).subscribe({ error: () => undefined });
  }

  totalRevenue(products: DigitalProduct[]): string {
    const total = products.reduce((sum, p) => sum + p.revenue, 0);
    return formatMoney(total, products[0]?.currency ?? 'INR');
  }

  activeCount(products: DigitalProduct[]): number {
    return products.filter((p) => p.status === 'active').length;
  }

  money(amount: number, currency: string): string {
    return formatMoney(amount, currency);
  }
}

function emptyForm(): StoreForm {
  return {
    title: '',
    type: 'ebook',
    price: '',
    currency: 'INR',
    fileName: '',
    downloadUrl: '',
    active: true,
  };
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
