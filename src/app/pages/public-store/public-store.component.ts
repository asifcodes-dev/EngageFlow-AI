import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, map, of, switchMap } from 'rxjs';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { PublicStore, PublicStoreProduct, PublicStoreService } from './public-store.service';

type State = { status: 'loading' } | { status: 'ok'; data: PublicStore } | { status: 'notfound' };

@Component({
  selector: 'app-public-store',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
  ],
  templateUrl: './public-store.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicStoreComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PublicStoreService);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly state$ = this.route.paramMap.pipe(
    map((p) => p.get('slug') ?? ''),
    switchMap((slug) =>
      this.api.getStore(slug).pipe(
        map((data): State => ({ status: 'ok', data })),
        catchError(() => of<State>({ status: 'notfound' })),
      ),
    ),
  );

  // ── Buy modal state ─────────────────────────────────────────────
  selectedProduct: PublicStoreProduct | null = null;
  buyerName = '';
  buyerEmail = '';
  buying = false;
  buyError = '';
  purchased = false;
  deliveredUrl: string | null = null;

  private get slug(): string {
    return this.route.snapshot.paramMap.get('slug') ?? '';
  }

  startBuy(product: PublicStoreProduct): void {
    this.selectedProduct = product;
    this.buyerName = '';
    this.buyerEmail = '';
    this.buyError = '';
    this.buying = false;
    this.purchased = false;
    this.deliveredUrl = null;
  }

  closeBuy(): void {
    this.selectedProduct = null;
  }

  async confirmBuy(): Promise<void> {
    if (!this.selectedProduct) return;
    this.buyError = '';
    if (!this.buyerName.trim()) {
      this.buyError = 'Please enter your name.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.buyerEmail)) {
      this.buyError = 'Please enter a valid email address.';
      return;
    }
    this.buying = true;
    try {
      const res = await this.api.buy(
        this.slug,
        {
          productId: this.selectedProduct.id,
          customerName: this.buyerName.trim(),
          customerEmail: this.buyerEmail.trim(),
        },
        this.selectedProduct.title,
      );
      // Razorpay's callback fires outside Angular's zone — re-enter for CD.
      this.zone.run(() => {
        this.buying = false;
        this.purchased = true;
        this.deliveredUrl = res.downloadUrl;
        this.cdr.markForCheck();
      });
    } catch (err: unknown) {
      this.zone.run(() => {
        this.buying = false;
        this.buyError = err instanceof Error ? err.message : 'Payment failed. Please try again.';
        this.cdr.markForCheck();
      });
    }
  }

  whatsappUrl(number: string): string {
    return `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
  }

  money(amount: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
