import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { FeatureLockComponent } from '../../../shared/components/ui/feature-lock/feature-lock.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { TextAreaComponent } from '../../../shared/components/form/input/text-area.component';
import { SelectComponent, Option } from '../../../shared/components/form/select/select.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { AiService } from '../../../shared/services/ai.service';
import { ProductService } from '../product-catalog/product.service';
import { Product } from '../product-catalog/product.model';

@Component({
  selector: 'app-reply-studio',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    FeatureLockComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    SelectComponent,
    CheckboxComponent,
  ],
  templateUrl: './reply-studio.component.html',
})
export class ReplyStudioComponent {
  private readonly connection = inject(ConnectionStateService);
  private readonly ai = inject(AiService);
  private readonly productService = inject(ProductService);

  readonly connected$ = this.connection.connected$;
  readonly productOptions$ = this.productService.products$.pipe(
    map((products): Option[] => [
      { value: '', label: 'No product linked' },
      ...products.map((p) => ({ value: p.id, label: p.name })),
    ]),
  );

  private products: Product[] = [];

  readonly toneOptions: Option[] = [
    { value: 'friendly', label: 'Friendly & warm' },
    { value: 'professional', label: 'Professional' },
    { value: 'playful', label: 'Playful' },
  ];
  readonly lengthOptions: Option[] = [
    { value: 'short', label: 'Short (1 line)' },
    { value: 'medium', label: 'Medium (2–3 lines)' },
  ];

  // Brand-voice settings (persist to backend later).
  businessName = 'Asif Store';
  tone = 'friendly';
  replyLength = 'short';
  languages = { english: true, hindi: true, hinglish: true, gujarati: false };
  avoidNotes = '';
  saved = false;

  // Playground
  playgroundComment = 'Bhai yeh kitne ka hai?';
  playgroundProduct = '';
  generatedReply = '';
  generating = false;

  constructor() {
    this.productService.products$.subscribe((p) => (this.products = p));
  }

  save(): void {
    this.saved = true;
  }

  generate(): void {
    this.generating = true;
    this.saved = false;
    this.generatedReply = '';
    const product = this.products.find((p) => p.id === this.playgroundProduct);

    this.ai
      .generateReply({
        businessName: this.businessName.trim() || 'My store',
        comment: this.playgroundComment,
        productName: product?.name,
        productDescription: product?.description,
        price: product?.price,
        currency: product?.currency,
      })
      .subscribe({
        next: (res) => {
          this.generating = false;
          this.generatedReply = res.reply;
        },
        error: () => {
          this.generating = false;
          // Graceful fallback so the playground still shows output if the AI call fails.
          const price = product ? `${currencySymbol(product.currency)}${product.price}` : '';
          this.generatedReply = product
            ? `Hi! 👋 ${product.name} is available for ${price}. DM us to order! 😊`
            : 'Hey! 👋 Thanks for reaching out — DM us for details. 😊';
        },
      });
  }
}

function currencySymbol(currency: string): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] ?? '';
}
