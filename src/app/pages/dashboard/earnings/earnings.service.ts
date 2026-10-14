import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type PayoutStatus = 'paid' | 'pending' | 'processing';

export interface Payout {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  reference: string;
}

export interface EarningsSummary {
  totalSales: number;
  platformFee: number;
  available: number;
  pending: number;
  paidOut: number;
  payouts: Payout[];
}

const EMPTY: EarningsSummary = {
  totalSales: 0,
  platformFee: 0,
  available: 0,
  pending: 0,
  paidOut: 0,
  payouts: [],
};

/**
 * Earnings backed by `GET {apiUrl}/earnings` (totals computed from paid orders +
 * payout history). Everything is 0/[] until real sales/payouts exist;
 * `catchError` falls back to the empty summary so the page never breaks.
 */
@Injectable({ providedIn: 'root' })
export class EarningsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/earnings`;

  private readonly subject = new BehaviorSubject<EarningsSummary>(EMPTY);
  readonly summary$: Observable<EarningsSummary> = this.subject.asObservable();
  readonly payouts$: Observable<Payout[]> = this.summary$.pipe(map((s) => s.payouts));

  load(): Observable<EarningsSummary> {
    return this.http.get<EarningsSummary>(this.baseUrl).pipe(
      tap((s) => this.subject.next(s)),
      catchError(() => {
        this.subject.next(EMPTY);
        return of(EMPTY);
      }),
    );
  }
}
