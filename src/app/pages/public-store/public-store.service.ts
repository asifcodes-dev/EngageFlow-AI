import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicStoreProduct {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  coverImageUrl: string | null;
  categoryId: string | null;
}

export interface PublicStore {
  store: {
    storeName: string;
    bio: string;
    logoUrl: string | null;
    instagram: string | null;
    whatsapp: string | null;
    youtube: string | null;
    twitter: string | null;
  };
  categories: { id: string; name: string; slug: string }[];
  products: PublicStoreProduct[];
}

export interface StoreCheckoutRequest {
  productId: string;
  customerName: string;
  customerEmail: string;
}

interface StoreCreatedOrder {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Reads and buys from the public storefront (`{apiUrl}/public/store/:slug`). No auth. */
@Injectable({ providedIn: 'root' })
export class PublicStoreService {
  private readonly http = inject(HttpClient);
  private scriptPromise: Promise<void> | null = null;

  getStore(slug: string): Observable<PublicStore> {
    return this.http.get<PublicStore>(`${environment.apiUrl}/public/store/${slug}`);
  }

  /**
   * Full purchase flow: load Razorpay Checkout → create the order on the backend
   * (server-owned amount) → open Checkout → verify the signature server-side.
   * Resolves with the download link once verified; rejects if the buyer cancels
   * or verification fails.
   */
  async buy(
    slug: string,
    req: StoreCheckoutRequest,
    productTitle: string,
  ): Promise<{ downloadUrl: string | null }> {
    await this.loadScript();
    const base = `${environment.apiUrl}/public/store/${slug}`;
    const order = await firstValueFrom(this.http.post<StoreCreatedOrder>(`${base}/checkout`, req));
    const Ctor = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;

    return new Promise<{ downloadUrl: string | null }>((resolve, reject) => {
      const rzp = new Ctor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: productTitle,
        description: 'Digital product',
        order_id: order.orderId,
        prefill: { name: req.customerName, email: req.customerEmail },
        theme: { color: '#465fff' },
        handler: (response) => {
          firstValueFrom(
            this.http.post<{ verified: boolean; downloadUrl: string | null }>(
              `${base}/verify`,
              response,
            ),
          )
            .then((res) => resolve({ downloadUrl: res.downloadUrl }))
            .catch((err: unknown) => reject(toError(err)));
        },
        modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      });
      rzp.open();
    });
  }

  private loadScript(): Promise<void> {
    if (this.scriptPromise) return this.scriptPromise;
    this.scriptPromise = new Promise<void>((resolve, reject) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = CHECKOUT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.scriptPromise = null;
        reject(new Error('Failed to load Razorpay Checkout.'));
      };
      document.body.appendChild(script);
    });
    return this.scriptPromise;
  }
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Payment verification failed.');
}
