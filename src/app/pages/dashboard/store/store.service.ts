import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';

export type ProductType = 'ebook' | 'course' | 'template' | 'bundle';
export type ProductStatus = 'active' | 'draft';

export interface DigitalProduct {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  currency: string;
  fileName: string;
  status: ProductStatus;
  sales: number;
  revenue: number;
}

export type DigitalProductInput = Omit<DigitalProduct, 'id' | 'sales' | 'revenue'>;

/** In-memory digital-product catalog (swap for the backend store API later). */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly subject = new BehaviorSubject<DigitalProduct[]>(seed());
  readonly products$: Observable<DigitalProduct[]> = this.subject.asObservable();

  create(input: DigitalProductInput): Observable<DigitalProduct> {
    const product: DigitalProduct = { id: crypto.randomUUID(), sales: 0, revenue: 0, ...input };
    return of(product).pipe(
      delay(150),
      tap((p) => this.subject.next([...this.subject.value, p])),
    );
  }

  remove(id: string): void {
    this.subject.next(this.subject.value.filter((p) => p.id !== id));
  }

  toggleStatus(id: string): void {
    this.subject.next(
      this.subject.value.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'draft' : 'active' } : p,
      ),
    );
  }
}

function seed(): DigitalProduct[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Instagram Growth eBook',
      type: 'ebook',
      price: 299,
      currency: 'INR',
      fileName: 'ig-growth.pdf',
      status: 'active',
      sales: 64,
      revenue: 19136,
    },
    {
      id: crypto.randomUUID(),
      title: 'Reels Templates Pack',
      type: 'template',
      price: 499,
      currency: 'INR',
      fileName: 'reels-pack.zip',
      status: 'active',
      sales: 28,
      revenue: 13972,
    },
    {
      id: crypto.randomUUID(),
      title: 'Automation Masterclass',
      type: 'course',
      price: 1999,
      currency: 'INR',
      fileName: 'masterclass.mp4',
      status: 'draft',
      sales: 0,
      revenue: 0,
    },
  ];
}
