import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
import { AiService } from '../../../shared/services/ai.service';
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
export class ProductCatalogComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly ai = inject(AiService);

  readonly products$ = this.productService.products$;

  readonly currencyOptions: Option[] = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  // List load state
  loading = false;
  loadError = '';

  // Add/edit modal state
  isModalOpen = false;
  editingId: string | null = null;
  submitted = false;
  saving = false;
  formError = '';
  form: ProductForm = emptyForm();

  // AI reply preview state
  previewLoading = false;
  previewText = '';
  previewError = '';
  private previewSub?: Subscription;

  // Delete-confirm modal state
  deleteTarget: Product | null = null;
  deleting = false;
  deleteError = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    this.productService.list().subscribe({
      next: () => (this.loading = false),
      error: () => {
        this.loading = false;
        this.loadError = 'Could not load your products. Please try again.';
      },
    });
  }

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
    // Match the backend Decimal(12,2) constraints so the user gets a clear inline
    // error instead of a cryptic 400 from the server.
    if (!/^\d+(\.\d{1,2})?$/.test(raw)) return 'Use a whole number or up to 2 decimals.';
    if (value > 99_999_999.99) return 'Price is too high.';
    return '';
  }

  openCreate(): void {
    this.editingId = null;
    this.form = emptyForm();
    this.resetModalFeedback();
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
    this.resetModalFeedback();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingId = null;
    this.form = emptyForm();
    this.resetModalFeedback();
  }

  save(): void {
    this.submitted = true;
    this.formError = '';
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
      error: (err: unknown) => {
        this.saving = false;
        // Surface the backend message (e.g. the plan-limit upgrade prompt).
        this.formError = extractMessage(err, 'Could not save the product. Please try again.');
      },
    });
  }

  /** Ask the AI engine how it would introduce the product to a customer. */
  previewReply(): void {
    this.previewError = '';
    this.previewText = '';
    const name = this.form.name.trim();
    if (!name) {
      this.previewError = 'Add a product name first.';
      return;
    }
    const rawPrice = this.form.price.trim();
    const price = Number(rawPrice);

    this.previewSub?.unsubscribe(); // cancel any earlier in-flight preview
    this.previewLoading = true;
    this.previewSub = this.ai
      .generateReply({
        businessName: 'My store',
        comment: "What's the price?",
        productName: name,
        productDescription: this.form.description.trim() || undefined,
        price: rawPrice && Number.isFinite(price) ? price : undefined,
        currency: this.form.currency,
      })
      .subscribe({
        next: (res) => {
          this.previewLoading = false;
          this.previewText = res.reply;
        },
        error: () => {
          this.previewLoading = false;
          // Graceful fallback (mirrors Reply Studio) when the AI is busy/unavailable.
          const symbol = currencySymbol(this.form.currency);
          this.previewText = rawPrice
            ? `Hi! 👋 ${name} is available for ${symbol}${rawPrice}. DM us to order! 😊`
            : `Hi! 👋 Thanks for asking about ${name} — DM us for details! 😊`;
          this.previewError = 'Showing a sample — AI preview is busy, try again in a moment.';
        },
      });
  }

  confirmDelete(product: Product): void {
    this.deleteTarget = product;
    this.deleteError = '';
  }

  cancelDelete(): void {
    this.deleteTarget = null;
    this.deleteError = '';
  }

  deleteConfirmed(): void {
    if (!this.deleteTarget) return;
    this.deleting = true;
    this.deleteError = '';
    this.productService.remove(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleting = false;
        this.deleteTarget = null;
      },
      error: (err: unknown) => {
        this.deleting = false;
        this.deleteError = extractMessage(err, 'Could not delete the product. Please try again.');
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

  private resetModalFeedback(): void {
    this.submitted = false;
    this.formError = '';
    this.previewText = '';
    this.previewError = '';
    this.previewLoading = false;
    // Drop any in-flight preview so a late response can't write into a
    // closed/reopened modal.
    this.previewSub?.unsubscribe();
    this.previewSub = undefined;
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

function currencySymbol(currency: string): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] ?? '';
}

/** Pull a human-readable message out of an HttpErrorResponse (Nest sends string|string[]). */
function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const message = (err.error as { message?: string | string[] } | null)?.message;
    if (Array.isArray(message)) return message.join(' ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}
