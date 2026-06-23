import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
  handle: string;
  email: string;
  tags: string[];
  lastActive: string;
  source: string;
}

/** In-memory contacts (swap for the backend contacts API later). */
@Injectable({ providedIn: 'root' })
export class AudienceService {
  private readonly subject = new BehaviorSubject<Contact[]>(seed());
  readonly contacts$: Observable<Contact[]> = this.subject.asObservable();
}

function seed(): Contact[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Priya Sharma',
      handle: '@priya.styles',
      email: 'priya@example.com',
      tags: ['buyer', 'saree'],
      lastActive: '2m ago',
      source: 'Comment flow',
    },
    {
      id: crypto.randomUUID(),
      name: 'Rahul Verma',
      handle: '@rahulv',
      email: 'rahul@example.com',
      tags: ['repeat'],
      lastActive: '1h ago',
      source: 'DM flow',
    },
    {
      id: crypto.randomUUID(),
      name: 'Sneha Patel',
      handle: '@sneha.boutique',
      email: 'sneha@example.com',
      tags: ['lead'],
      lastActive: 'Yesterday',
      source: 'Story reply',
    },
    {
      id: crypto.randomUUID(),
      name: 'Aman Gupta',
      handle: '@aman.gupta',
      email: 'aman@example.com',
      tags: ['ebook'],
      lastActive: '2 days ago',
      source: 'Lead magnet',
    },
    {
      id: crypto.randomUUID(),
      name: 'Divya R',
      handle: '@divya.r',
      email: 'divya@example.com',
      tags: ['coaching', 'vip'],
      lastActive: '3 days ago',
      source: 'DM flow',
    },
  ];
}
