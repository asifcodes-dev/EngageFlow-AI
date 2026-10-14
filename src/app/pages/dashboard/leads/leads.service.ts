import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AnalyticsService, LeadEntry } from '../../../shared/services/analytics.service';

/** A captured lead = a price-inquiry comment surfaced by the automation. */
export type Lead = LeadEntry;

/**
 * Captured leads backed by the backend ({apiUrl}/analytics/leads via
 * AnalyticsService). Keeps a BehaviorSubject mirror so the page reacts to loads.
 */
@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly analytics = inject(AnalyticsService);

  private readonly subject = new BehaviorSubject<Lead[]>([]);
  readonly leads$: Observable<Lead[]> = this.subject.asObservable();

  /** Fetch leads and push them into `leads$`. */
  load(): Observable<Lead[]> {
    return this.analytics.getLeads().pipe(tap((leads) => this.subject.next(leads)));
  }
}
