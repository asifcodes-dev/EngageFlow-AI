import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type OrderStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type DeliveryStatus = 'sent' | 'pending';

export interface Order {
  id: string;
  ref: string;
  product: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  delivery: DeliveryStatus;
  createdAt: string;
}

/**
 * End-customer orders backed by the backend (`GET {apiUrl}/orders`). Empty until
 * a checkout flow writes real sales — `catchError` keeps the UI on an empty list
 * if the endpoint isn't reachable, so nothing breaks pre-launch.
 */
@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  private readonly subject = new BehaviorSubject<Order[]>([]);
  readonly orders$: Observable<Order[]> = this.subject.asObservable();

  load(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      tap((orders) => this.subject.next(orders)),
      catchError(() => {
        this.subject.next([]);
        return of([]);
      }),
    );
  }
}
