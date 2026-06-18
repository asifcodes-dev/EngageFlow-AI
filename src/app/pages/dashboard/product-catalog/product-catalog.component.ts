import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { TextAreaComponent } from '../../../shared/components/form/input/text-area.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { ProductService } from './product.service';
import { Currency, Product, ProductInput } from './product.model';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  currency: string;
  keywords: string;
}

@Component({
  selector: 'app-product-catalog',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ModalComponent,
    ButtonComponent,
    BadgeComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    SelectComponent,
  ],
  templateUrl: './product-catalog.component.html',
  styles: ``,
})
export class ProductCatalogComponent {
  private readonly productService = inject(ProductService);

  readonly products$ = this.productService.products$;

  readonly currencyOptions: Option[] = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  // Add/edit modal state
  isModalOpen = false;
  editingId: string | null = null;
  submitted = false;
  saving = false;
  form: ProductForm = emptyForm();

  // Delete-confirm modal state
  deleteTarget: Product | null = null;
  deleting = false;

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  get nameError(): string {
    if (!this.submitted) return '';
    return this.form.name.trim() ? '' : 'Product name is required.';
  }

  get priceError(): string {
    if (!this.submitted) return '';
    const raw = this.form.price.trim();
    if (!raw) return 'Price is required.';
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return 'Enter a valid price (0 or more).';
    return '';
  }

  openCreate(): void {
    this.editingId = null;
    this.form = emptyForm();
    this.submitted = false;
    this.isModalOpen = true;
  }

  openEdit(product: Product): void {
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description,
      price: String(product.price),
      currency: product.currency,
      keywords: product.keywords.join(', '),
    };
    this.submitted = false;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingId = null;
    this.submitted = false;
    this.form = emptyForm();
  }

  save(): void {
    this.submitted = true;
    if (this.nameError || this.priceError) return;

    const input: ProductInput = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      price: Number(this.form.price.trim()),
      currency: this.form.currency as Currency,
      keywords: parseKeywords(this.form.keywords),
    };

    this.saving = true;
    const request$ =
      this.editingId !== null
        ? this.productService.update(this.editingId, input)
        : this.productService.create(input);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  confirmDelete(product: Product): void {
    this.deleteTarget = product;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }

  deleteConfirmed(): void {
    if (!this.deleteTarget) return;
    this.deleting = true;
    this.productService.remove(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleting = false;
        this.deleteTarget = null;
      },
      error: () => {
        this.deleting = false;
      },
    });
  }

  formatPrice(product: Product): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: product.currency,
      maximumFractionDigits: 2,
    }).format(product.price);
  }
}

function emptyForm(): ProductForm {
  return { name: '', description: '', price: '', currency: 'INR', keywords: '' };
}

function parseKeywords(raw: string): string[] {
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}
