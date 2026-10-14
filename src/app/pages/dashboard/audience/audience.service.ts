import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { AnalyticsService, ContactEntry } from '../../../shared/services/analytics.service';

/** A contact = a person who interacted (derived from automation events). */
export type Contact = ContactEntry;

/**
 * Audience/contacts backed by `GET {apiUrl}/analytics/audience` (distinct people
 * from interaction events). Empty until events accrue; `catchError` keeps the UI
 * on an empty list if the endpoint isn't reachable.
 */
@Injectable({ providedIn: 'root' })
export class AudienceService {
  private readonly analytics = inject(AnalyticsService);

  private readonly subject = new BehaviorSubject<Contact[]>([]);
  readonly contacts$: Observable<Contact[]> = this.subject.asObservable();

  load(): Observable<Contact[]> {
    return this.analytics.getAudience().pipe(
      tap((contacts) => this.subject.next(contacts)),
      catchError(() => {
        this.subject.next([]);
        return of([]);
      }),
    );
  }
}
