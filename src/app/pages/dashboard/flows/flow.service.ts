import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type FlowTrigger = 'comment' | 'dm' | 'story_reply';
export type FlowStatus = 'active' | 'paused';
export type FlowScope = 'all' | 'specific';

export interface Flow {
  id: string;
  name: string;
  trigger: FlowTrigger;
  /** Comma-separated keywords (for display/edit). */
  keyword: string;
  productId: string | null;
  productName: string | null;
  scope: FlowScope;
  postIds: string[];
  followGate: boolean;
  status: FlowStatus;
  runs: number;
}

export interface FlowInput {
  name: string;
  trigger: FlowTrigger;
  keyword: string;
  productId: string | null;
  scope: FlowScope;
  postIds: string[];
  followGate: boolean;
}

/** Wire shape of the backend AutomationRule (GET/POST/PATCH /automation-rules). */
interface ApiRule {
  id: string;
  name: string;
  triggerType: 'COMMENT' | 'DIRECT_MESSAGE' | 'STORY_REPLY';
  keywords: string[];
  postScope: 'ALL' | 'SPECIFIC';
  postIds: string[];
  followGate: boolean;
  productId: string | null;
  productName: string | null;
  isActive: boolean;
  matchCount: number;
}

/**
 * Automation rules ("flows") backed by the EngageFlow backend
 * (REST under {apiUrl}/automation-rules, userId-scoped server-side). Keeps a
 * BehaviorSubject mirror (`flows$`) so the page reacts to changes without
 * re-fetching. The JWT bearer token is attached by the auth interceptor.
 */
@Injectable({ providedIn: 'root' })
export class FlowService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/automation-rules`;

  private readonly subject = new BehaviorSubject<Flow[]>([]);
  readonly flows$: Observable<Flow[]> = this.subject.asObservable();

  /** Fetch all rules and push them into `flows$`. */
  load(): Observable<Flow[]> {
    return this.http.get<ApiRule[]>(this.baseUrl).pipe(
      map((rules) => rules.map(fromApi)),
      tap((flows) => this.subject.next(flows)),
    );
  }

  create(input: FlowInput): Observable<Flow> {
    return this.http.post<ApiRule>(this.baseUrl, toApiCreate(input)).pipe(
      map(fromApi),
      tap((flow) => this.subject.next([flow, ...this.subject.value])),
    );
  }

  /** Flip active/paused via PATCH { isActive }. */
  toggle(flow: Flow): Observable<Flow> {
    const isActive = flow.status !== 'active';
    return this.http.patch<ApiRule>(`${this.baseUrl}/${flow.id}`, { isActive }).pipe(
      map(fromApi),
      tap((updated) =>
        this.subject.next(this.subject.value.map((f) => (f.id === updated.id ? updated : f))),
      ),
    );
  }

  remove(flow: Flow): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${flow.id}`)
      .pipe(tap(() => this.subject.next(this.subject.value.filter((f) => f.id !== flow.id))));
  }
}

// ── mapping helpers (backend ↔ UI) ──────────────────────────────────

function toApiCreate(input: FlowInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: input.name,
    triggerType: toTriggerType(input.trigger),
    keywords: splitKeywords(input.keyword),
    postScope: input.scope === 'specific' ? 'SPECIFIC' : 'ALL',
    postIds: input.scope === 'specific' ? input.postIds : [],
    followGate: input.followGate,
    isActive: true,
  };
  // Omit productId when none is chosen so the backend's @IsUUID doesn't reject ''.
  if (input.productId) body['productId'] = input.productId;
  return body;
}

function fromApi(r: ApiRule): Flow {
  return {
    id: r.id,
    name: r.name,
    trigger: fromTriggerType(r.triggerType),
    keyword: r.keywords.join(', '),
    productId: r.productId,
    productName: r.productName,
    scope: r.postScope === 'SPECIFIC' ? 'specific' : 'all',
    postIds: r.postIds,
    followGate: r.followGate,
    status: r.isActive ? 'active' : 'paused',
    runs: r.matchCount,
  };
}

function toTriggerType(t: FlowTrigger): ApiRule['triggerType'] {
  if (t === 'dm') return 'DIRECT_MESSAGE';
  if (t === 'story_reply') return 'STORY_REPLY';
  return 'COMMENT';
}

function fromTriggerType(t: ApiRule['triggerType']): FlowTrigger {
  if (t === 'DIRECT_MESSAGE') return 'dm';
  if (t === 'STORY_REPLY') return 'story_reply';
  return 'comment';
}

function splitKeywords(s: string): string[] {
  return s
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}
