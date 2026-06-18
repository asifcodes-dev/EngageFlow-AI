import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Product, ProductInput } from './product.model';

/**
 * Mocked, in-memory product catalog backed by an RxJS BehaviorSubject — mirrors
 * the service pattern in shared/services/auth.service.ts.
 *
 * Every method returns an Observable so the component's subscribe code is
 * identical to the eventual HttpClient version: swapping this mock for real API
 * calls is a single-file change (replace the `of(...)` bodies with `http.*`).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>(seedProducts());

  /** Read-only stream of the current catalog. */
  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  list(): Observable<Product[]> {
    return this.products$;
  }

  create(input: ProductInput): Observable<Product> {
    const product: Product = { id: crypto.randomUUID(), ...input };
    return of(product).pipe(
      delay(200),
      tap((created) => this.productsSubject.next([...this.snapshot, created])),
    );
  }

  update(id: string, input: ProductInput): Observable<Product> {
    const updated: Product = { id, ...input };
    return of(updated).pipe(
      delay(200),
      tap((next) => this.productsSubject.next(this.snapshot.map((p) => (p.id === id ? next : p)))),
    );
  }

  remove(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(200),
      tap(() => this.productsSubject.next(this.snapshot.filter((p) => p.id !== id))),
      map(() => undefined),
    );
  }

  private get snapshot(): Product[] {
    return this.productsSubject.value;
  }
}

/** Sample catalog so the page is populated on first load (India-aware, INR). */
function seedProducts(): Product[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Handloom Cotton Saree',
      description: 'Pure handwoven cotton saree with blouse piece. Free shipping across India.',
      price: 1499,
      currency: 'INR',
      keywords: ['saree', 'price', 'cotton', 'buy'],
    },
    {
      id: crypto.randomUUID(),
      name: 'Instagram Growth eBook',
      description: 'Digital PDF guide to grow your Instagram business in 30 days.',
      price: 299,
      currency: 'INR',
      keywords: ['ebook', 'guide', 'pdf', 'download'],
    },
    {
      id: crypto.randomUUID(),
      name: '1:1 Coaching Call (30 min)',
      description: 'Live strategy call to plan your content and automation setup.',
      price: 999,
      currency: 'INR',
      keywords: ['coaching', 'call', 'consult', 'booking'],
    },
  ];
}
