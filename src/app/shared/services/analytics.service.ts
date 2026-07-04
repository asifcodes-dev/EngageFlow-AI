import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AnalyticsRange = 'today' | '7d' | '30d';

/** Aggregated metrics for the Insights dashboard (mirrors the backend shape). */
export interface AnalyticsSummary {
  range: AnalyticsRange;
  totals: {
    dmsSent: number;
    commentReplies: number;
    leadsCaptured: number;
    sales: number;
    spamDeleted: number;
    abuseDeleted: number;
    followersGained: number;
    contacts: number;
    // Live counts that back the trackable cards shown in place of the
    // not-yet-possible DMs/sales/followers metrics.
    activeFlows: number;
    catalogSize: number;
  };
  series: {
    categories: string[];
    commentReplies: number[];
    dmsSent: number[];
    actions: number[];
  };
}

/** Per-product interest over the window, for the "Top products" insight. */
export interface TopProduct {
  productName: string;
  leads: number;
  replies: number;
}

/** A captured lead (a price-inquiry comment) for the Leads inbox. */
export interface LeadEntry {
  id: string;
  username: string | null;
  productName: string | null;
  text: string | null;
  capturedAt: string;
}

/** A moderated/handled comment for the Comment Guard activity feed. */
export interface ModeratedCommentEntry {
  id: string;
  author: string;
  handle: string;
  text: string;
  category: 'genuine' | 'inquiry' | 'spam' | 'abuse';
  action: 'kept' | 'hidden' | 'deleted' | 'pending';
  postedAt: string;
}

/** A contact for the Audience page (derived from interaction events). */
export interface ContactEntry {
  id: string;
  name: string;
  handle: string;
  email: string;
  tags: string[];
  lastActive: string;
  source: string;
}

/**
 * Reads the subscriber's automation metrics from the backend (JWT attached by
 * the auth interceptor).
 * Backend contract (all userId-scoped server-side):
 *   GET {apiUrl}/analytics/summary?range=today|7d|30d  -> AnalyticsSummary
 *   GET {apiUrl}/analytics/products?range=today|7d|30d -> TopProduct[]
 *   GET {apiUrl}/analytics/leads                       -> LeadEntry[]
 *   GET {apiUrl}/analytics/moderation                  -> ModeratedCommentEntry[]
 *   GET {apiUrl}/analytics/audience                    -> ContactEntry[]
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  getSummary(range: AnalyticsRange): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.baseUrl}/summary`, {
      params: { range },
    });
  }

  getTopProducts(range: AnalyticsRange): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.baseUrl}/products`, {
      params: { range },
    });
  }

  getLeads(): Observable<LeadEntry[]> {
    return this.http.get<LeadEntry[]>(`${this.baseUrl}/leads`);
  }

  getModeration(): Observable<ModeratedCommentEntry[]> {
    return this.http.get<ModeratedCommentEntry[]>(`${this.baseUrl}/moderation`);
  }

  getAudience(): Observable<ContactEntry[]> {
    return this.http.get<ContactEntry[]>(`${this.baseUrl}/audience`);
  }
}
