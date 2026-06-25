import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, ProductInput } from './product.model';

/**
 * Product catalog backed by the EngageFlow backend (REST under {apiUrl}/products).
 * Keeps a BehaviorSubject mirror (`products$`) so both consumers — the catalog
 * page and Reply Studio — react to changes without re-fetching. The JWT bearer
 * token is attached automatically by the auth interceptor.
 *
 * Backend contract (userId-scoped server-side):
 *   GET    {apiUrl}/products        -> Product[]
 *   POST   {apiUrl}/products        ProductInput -> Product
 *   PATCH  {apiUrl}/products/:id    ProductInput -> Product
 *   DELETE {apiUrl}/products/:id    -> 204
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  /** Read-only stream of the current catalog. */
  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  private loaded = false;

  /**
   * Fetch the catalog once (idempotent) so `products$` is populated for consumers
   * that only read the stream (e.g. Reply Studio's product dropdown).
   */
  ensureLoaded(): void {
    if (this.loaded) return;
    this.list().subscribe({
      error: () => {
        /* keep products$ empty; the page handles its own error state */
      },
    });
  }

  /** Fetch the catalog and push it into `products$`. */
  list(): Observable<Product[]> {
    // Mark loaded at request start (not on response) so a concurrent ensureLoaded()
    // can't fire a second GET while this one is still in flight; reset on failure.
    this.loaded = true;
    return this.http.get<Product[]>(this.baseUrl).pipe(
      tap((products) => this.productsSubject.next(products)),
      catchError((err) => {
        this.loaded = false;
        return throwError(() => err);
      }),
    );
  }

  create(input: ProductInput): Observable<Product> {
    return this.http
      .post<Product>(this.baseUrl, input)
      .pipe(tap((created) => this.productsSubject.next([created, ...this.snapshot])));
  }

  update(id: string, input: ProductInput): Observable<Product> {
    return this.http
      .patch<Product>(`${this.baseUrl}/${id}`, input)
      .pipe(
        tap((next) =>
          this.productsSubject.next(this.snapshot.map((p) => (p.id === id ? next : p))),
        ),
      );
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.productsSubject.next(this.snapshot.filter((p) => p.id !== id))));
  }

  private get snapshot(): Product[] {
    return this.productsSubject.value;
  }
}
