import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Response from the backend's create-order endpoint. `keyId` is publishable. */
export interface CreatedOrder {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
}

export interface CheckoutResult {
  verified: boolean;
  paymentId: string;
}

/** Fields Razorpay Checkout hands back on a successful payment. */
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
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export interface CheckoutParams {
  amount: number; // major unit (e.g. rupees)
  currency?: string;
  name?: string;
  description?: string;
  prefill?: RazorpayOptions['prefill'];
}

/**
 * Single integration point for Razorpay payments. The secret stays on the
 * backend; this only ever uses the publishable key id returned by create-order.
 *
 * Backend contract:
 *   POST {apiUrl}/payments/create-order  { amount, currency } -> CreatedOrder
 *   POST {apiUrl}/payments/verify        { razorpay_* fields } -> { verified }
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private scriptPromise: Promise<void> | null = null;

  createOrder(amount: number, currency = 'INR'): Promise<CreatedOrder> {
    return firstValueFrom(
      this.http.post<CreatedOrder>(`${environment.apiUrl}/payments/create-order`, {
        amount,
        currency,
      }),
    );
  }

  verify(payload: RazorpaySuccessResponse): Promise<{ verified: boolean }> {
    return firstValueFrom(
      this.http.post<{ verified: boolean }>(`${environment.apiUrl}/payments/verify`, payload),
    );
  }

  /**
   * Full flow: load Checkout → create order on the backend → open Checkout →
   * verify the signature on the backend. Resolves once the payment is verified,
   * rejects if the user dismisses the modal or verification fails.
   */
  async checkout(params: CheckoutParams): Promise<CheckoutResult> {
    await this.loadCheckoutScript();
    const order = await this.createOrder(params.amount, params.currency ?? 'INR');
    const RazorpayCtor = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;

    return new Promise<CheckoutResult>((resolve, reject) => {
      const checkout = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: params.name ?? 'EngageFlow AI',
        description: params.description,
        order_id: order.orderId,
        prefill: params.prefill,
        theme: { color: '#465fff' },
        handler: (response) => {
          this.verify(response)
            .then((res) =>
              resolve({ verified: res.verified, paymentId: response.razorpay_payment_id }),
            )
            .catch((error: unknown) => reject(toError(error)));
        },
        modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      });
      checkout.open();
    });
  }

  private loadCheckoutScript(): Promise<void> {
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
