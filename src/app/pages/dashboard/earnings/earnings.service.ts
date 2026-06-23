import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type PayoutStatus = 'paid' | 'pending' | 'processing';

export interface Payout {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  reference: string;
}

/** In-memory payout history (swap for the backend payouts API later). */
@Injectable({ providedIn: 'root' })
export class EarningsService {
  private readonly subject = new BehaviorSubject<Payout[]>(seed());
  readonly payouts$: Observable<Payout[]> = this.subject.asObservable();
}

function seed(): Payout[] {
  return [
    {
      id: crypto.randomUUID(),
      date: '12 Jun 2026',
      amount: 9180,
      currency: 'INR',
      status: 'paid',
      reference: 'PO-2291',
    },
    {
      id: crypto.randomUUID(),
      date: '05 Jun 2026',
      amount: 6420,
      currency: 'INR',
      status: 'paid',
      reference: 'PO-2274',
    },
    {
      id: crypto.randomUUID(),
      date: '19 Jun 2026',
      amount: 4650,
      currency: 'INR',
      status: 'processing',
      reference: 'PO-2310',
    },
  ];
}
