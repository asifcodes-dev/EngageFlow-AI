import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';

export type FlowTrigger = 'comment' | 'dm' | 'story_reply';
export type FlowStatus = 'active' | 'paused';

export interface Flow {
  id: string;
  name: string;
  trigger: FlowTrigger;
  keyword: string;
  product: string;
  followGate: boolean;
  status: FlowStatus;
  runs: number;
}

export type FlowInput = Omit<Flow, 'id' | 'runs'>;

/**
 * In-memory automation flows (mirrors the ProductService mock pattern). Swap the
 * `of(...)` bodies for HttpClient calls when the backend Flows API is ready.
 */
@Injectable({ providedIn: 'root' })
export class FlowService {
  private readonly subject = new BehaviorSubject<Flow[]>(seed());
  readonly flows$: Observable<Flow[]> = this.subject.asObservable();

  create(input: FlowInput): Observable<Flow> {
    const flow: Flow = { id: crypto.randomUUID(), runs: 0, ...input };
    return of(flow).pipe(
      delay(150),
      tap((f) => this.subject.next([...this.subject.value, f])),
    );
  }

  toggle(id: string): void {
    this.subject.next(
      this.subject.value.map((f) =>
        f.id === id ? { ...f, status: f.status === 'active' ? 'paused' : 'active' } : f,
      ),
    );
  }

  remove(id: string): void {
    this.subject.next(this.subject.value.filter((f) => f.id !== id));
  }
}

function seed(): Flow[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Saree price reply',
      trigger: 'comment',
      keyword: 'price, kitne, cost',
      product: 'Handloom Cotton Saree',
      followGate: false,
      status: 'active',
      runs: 412,
    },
    {
      id: crypto.randomUUID(),
      name: 'eBook DM funnel',
      trigger: 'dm',
      keyword: 'ebook, guide',
      product: 'Instagram Growth eBook',
      followGate: true,
      status: 'active',
      runs: absoluteRuns(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Story reply → coaching',
      trigger: 'story_reply',
      keyword: 'coaching, call',
      product: '1:1 Coaching Call (30 min)',
      followGate: false,
      status: 'paused',
      runs: 57,
    },
  ];
}

function absoluteRuns(): number {
  return 138;
}
