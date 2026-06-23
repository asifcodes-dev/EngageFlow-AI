import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Lead {
  id: string;
  name: string;
  email: string;
  goal: string;
  source: string;
  capturedAt: string;
}

/** In-memory captured leads (swap for the backend leads API later). */
@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly subject = new BehaviorSubject<Lead[]>(seed());
  readonly leads$: Observable<Lead[]> = this.subject.asObservable();
}

function seed(): Lead[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Meera Joshi',
      email: 'meera@example.com',
      goal: 'Grow my boutique',
      source: 'eBook DM funnel',
      capturedAt: 'Today',
    },
    {
      id: crypto.randomUUID(),
      name: 'Karan Singh',
      email: 'karan@example.com',
      goal: 'Sell online courses',
      source: 'Story reply → coaching',
      capturedAt: 'Today',
    },
    {
      id: crypto.randomUUID(),
      name: 'Fatima Khan',
      email: 'fatima@example.com',
      goal: 'More leads from Instagram',
      source: 'eBook DM funnel',
      capturedAt: 'Yesterday',
    },
    {
      id: crypto.randomUUID(),
      name: 'Vikram N',
      email: 'vikram@example.com',
      goal: 'Automate replies',
      source: 'Comment flow',
      capturedAt: '2 days ago',
    },
  ];
}
