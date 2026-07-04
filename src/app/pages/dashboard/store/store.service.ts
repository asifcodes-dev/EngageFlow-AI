import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type ProductType = 'ebook' | 'course' | 'template' | 'bundle';
export type ProductStatus = 'active' | 'draft';

export interface DigitalProduct {
  id: string;
  title: string;
  description?: string;
  type: ProductType;
  price: number;
  currency: string;
  fileName: string;
  coverImageUrl?: string | null;
  downloadUrl?: string | null;
  status: ProductStatus;
  categoryId?: string | null;
  sales: number;
  revenue: number;
}

export type DigitalProductInput = Omit<DigitalProduct, 'id' | 'sales' | 'revenue'>;

/** The subscriber's public storefront settings. */
export interface StoreSettings {
  storeName: string;
  slug: string;
  bio: string;
  logoUrl: string | null;
  instagram: string | null;
  whatsapp: string | null;
  youtube: string | null;
  twitter: string | null;
  isActive: boolean;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * Digital-product store backed by the backend (`{apiUrl}/store`) — products,
 * storefront settings, and categories. `catchError` keeps the product list empty
 * if the API is down.
 */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/store`;

  private readonly subject = new BehaviorSubject<DigitalProduct[]>([]);
  readonly products$: Observable<DigitalProduct[]> = this.subject.asObservable();

  // ── Products ────────────────────────────────────────────────────

  load(): Observable<DigitalProduct[]> {
    return this.http.get<DigitalProduct[]>(this.baseUrl).pipe(
      tap((products) => this.subject.next(products)),
      catchError(() => {
        this.subject.next([]);
        return of([]);
      }),
    );
  }

  create(input: DigitalProductInput): Observable<DigitalProduct> {
    return this.http
      .post<DigitalProduct>(this.baseUrl, input)
      .pipe(tap((created) => this.subject.next([created, ...this.subject.value])));
  }

  toggleStatus(product: DigitalProduct): Observable<DigitalProduct> {
    const status: ProductStatus = product.status === 'active' ? 'draft' : 'active';
    return this.http
      .patch<DigitalProduct>(`${this.baseUrl}/${product.id}`, { status })
      .pipe(
        tap((updated) =>
          this.subject.next(this.subject.value.map((p) => (p.id === updated.id ? updated : p))),
        ),
      );
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.subject.next(this.subject.value.filter((p) => p.id !== id))));
  }

  // ── Storefront settings ─────────────────────────────────────────

  getSettings(): Observable<StoreSettings | null> {
    return this.http.get<StoreSettings | null>(`${this.baseUrl}/settings`);
  }

  saveSettings(settings: StoreSettings): Observable<StoreSettings> {
    return this.http.patch<StoreSettings>(`${this.baseUrl}/settings`, settings);
  }

  // ── Categories ──────────────────────────────────────────────────

  listCategories(): Observable<StoreCategory[]> {
    return this.http.get<StoreCategory[]>(`${this.baseUrl}/categories`);
  }

  createCategory(name: string): Observable<StoreCategory> {
    return this.http.post<StoreCategory>(`${this.baseUrl}/categories`, { name });
  }

  removeCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }
}
