import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ── Contracts mirrored 1:1 from the backend AdminService ───────────────────
// Money is integer PAISE (fields suffixed `Paise`) — format with InrPaisePipe.
// Dates are ISO strings; all daily buckets are UTC.

export type AdminRange = '7d' | '30d' | '90d';
export type SubscriberSort = 'createdAt' | 'email' | 'name';

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminOverview {
  totalSubscribers: number;
  activeTrials: number;
  payingSubscribers: number;
  revenue30dPaise: number;
  requestsToday: number;
}

export interface AdminSubscriberRow {
  id: string;
  email: string;
  name: string | null;
  tier: 'PRO' | 'BUSINESS' | null;
  effectiveTier: 'PRO' | 'BUSINESS' | null;
  isTrialing: boolean;
  trialDaysLeft: number;
  igAccounts: number;
  flows: number;
  products: number;
  revenuePaise: number;
  gmvPaise: number;
  createdAt: string;
}

export interface AdminIgAccount {
  id: string;
  username: string;
  instagramUserId: string;
  connectedAt: string;
  tokenExpiresAt: string | null;
}

export interface AdminUsageSeries {
  range: AdminRange;
  accountId: string | null;
  series: {
    categories: string[];
    total: number[];
    errors: number[];
  };
  byFeature: { feature: string; count: number; errorCount: number }[];
}

export interface AdminFeatureStat {
  feature: string;
  count: number;
  errorCount: number;
  errorRate: number;
  avgDurationMs: number | null;
  uniqueUsers: number;
}

export interface AdminFeatureBoard {
  range: AdminRange;
  accountId: string | null;
  items: AdminFeatureStat[];
}

export interface AdminUsageMeter {
  used: number;
  limit: number | null; // null = unlimited
}

export interface AdminSubscriberDetail {
  id: string;
  email: string;
  name: string | null;
  businessName: string | null;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  tier: 'PRO' | 'BUSINESS' | null;
  access: {
    effectiveTier: 'PRO' | 'BUSINESS' | null;
    isTrialing: boolean;
    trialDaysLeft: number;
  };
  usage: {
    products: AdminUsageMeter;
    flows: AdminUsageMeter;
    ai: AdminUsageMeter;
    accounts: AdminUsageMeter;
  };
  igAccounts: AdminIgAccount[];
  revenuePaise: number;
  gmvPaise: number;
  recentPayments: {
    id: string;
    amountPaise: number;
    currency: string;
    status: 'CREATED' | 'PAID' | 'FAILED';
    tier: 'PRO' | 'BUSINESS' | null;
    createdAt: string;
  }[];
}

export interface AdminUsageLogRow {
  id: string;
  feature: string;
  method: string;
  route: string;
  status: number;
  source: 'API' | 'WORKER';
  accountId: string | null;
  accountUsername: string | null;
  durationMs: number;
  createdAt: string;
}

/**
 * Super-admin analytics API ({apiUrl}/admin/*). Server-enforced ADMIN-only
 * (403 for everyone else); the JWT rides in via the auth interceptor.
 * Stateless cold observables — every call is parameterized, so page
 * components own their own loading state.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  getOverview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(`${this.baseUrl}/overview`);
  }

  getSubscribers(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: SubscriberSort;
    dir?: 'asc' | 'desc';
  }): Observable<Paginated<AdminSubscriberRow>> {
    let params = new HttpParams()
      .set('page', options.page ?? 1)
      .set('pageSize', options.pageSize ?? 20)
      .set('sort', options.sort ?? 'createdAt')
      .set('dir', options.dir ?? 'desc');
    if (options.search?.trim()) params = params.set('search', options.search.trim());
    return this.http.get<Paginated<AdminSubscriberRow>>(
      `${this.baseUrl}/subscribers`,
      { params },
    );
  }

  getSubscriberDetail(id: string): Observable<AdminSubscriberDetail> {
    return this.http.get<AdminSubscriberDetail>(`${this.baseUrl}/subscribers/${id}`);
  }

  getSubscriberAccounts(id: string): Observable<AdminIgAccount[]> {
    return this.http.get<AdminIgAccount[]>(
      `${this.baseUrl}/subscribers/${id}/accounts`,
    );
  }

  getSubscriberUsage(
    id: string,
    range: AdminRange,
    accountId?: string,
  ): Observable<AdminUsageSeries> {
    let params = new HttpParams().set('range', range);
    if (accountId) params = params.set('accountId', accountId);
    return this.http.get<AdminUsageSeries>(
      `${this.baseUrl}/subscribers/${id}/usage`,
      { params },
    );
  }

  getSubscriberLogs(
    id: string,
    page: number,
    pageSize = 20,
  ): Observable<Paginated<AdminUsageLogRow>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Paginated<AdminUsageLogRow>>(
      `${this.baseUrl}/subscribers/${id}/logs`,
      { params },
    );
  }

  getFeatureBoard(
    range: AdminRange,
    accountId?: string,
  ): Observable<AdminFeatureBoard> {
    let params = new HttpParams().set('range', range);
    if (accountId) params = params.set('accountId', accountId);
    return this.http.get<AdminFeatureBoard>(`${this.baseUrl}/features`, { params });
  }
}
