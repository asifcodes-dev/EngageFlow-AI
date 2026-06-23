import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

/** In-memory orders (swap for the backend orders API later). */
@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly subject = new BehaviorSubject<Order[]>(seed());
  readonly orders$: Observable<Order[]> = this.subject.asObservable();
}

function seed(): Order[] {
  return [
    {
      id: crypto.randomUUID(),
      ref: 'EF-1042',
      product: 'Instagram Growth eBook',
      customer: 'Priya Sharma',
      email: 'priya@example.com',
      amount: 299,
      currency: 'INR',
      status: 'paid',
      delivery: 'sent',
      createdAt: 'Today',
    },
    {
      id: crypto.randomUUID(),
      ref: 'EF-1041',
      product: 'Reels Templates Pack',
      customer: 'Rahul Verma',
      email: 'rahul@example.com',
      amount: 499,
      currency: 'INR',
      status: 'paid',
      delivery: 'sent',
      createdAt: 'Today',
    },
    {
      id: crypto.randomUUID(),
      ref: 'EF-1040',
      product: 'Instagram Growth eBook',
      customer: 'Sneha Patel',
      email: 'sneha@example.com',
      amount: 299,
      currency: 'INR',
      status: 'pending',
      delivery: 'pending',
      createdAt: 'Yesterday',
    },
    {
      id: crypto.randomUUID(),
      ref: 'EF-1039',
      product: 'Reels Templates Pack',
      customer: 'Aman Gupta',
      email: 'aman@example.com',
      amount: 499,
      currency: 'INR',
      status: 'failed',
      delivery: 'pending',
      createdAt: 'Yesterday',
    },
    {
      id: crypto.randomUUID(),
      ref: 'EF-1038',
      product: 'Automation Masterclass',
      customer: 'Divya R',
      email: 'divya@example.com',
      amount: 1999,
      currency: 'INR',
      status: 'refunded',
      delivery: 'sent',
      createdAt: '2 days ago',
    },
  ];
}
