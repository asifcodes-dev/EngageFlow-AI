import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type CommentCategory = 'genuine' | 'inquiry' | 'spam' | 'abuse';
export type CommentAction = 'kept' | 'hidden' | 'deleted' | 'pending';

export interface ModeratedComment {
  id: string;
  author: string;
  handle: string;
  text: string;
  category: CommentCategory;
  action: CommentAction;
  postedAt: string;
}

/** In-memory moderation queue (swap for the backend moderation API later). */
@Injectable({ providedIn: 'root' })
export class CommentGuardService {
  private readonly subject = new BehaviorSubject<ModeratedComment[]>(seed());
  readonly comments$: Observable<ModeratedComment[]> = this.subject.asObservable();

  setAction(id: string, action: CommentAction): void {
    this.subject.next(this.subject.value.map((c) => (c.id === id ? { ...c, action } : c)));
  }
}

function seed(): ModeratedComment[] {
  return [
    {
      id: crypto.randomUUID(),
      author: 'Priya Sharma',
      handle: '@priya.styles',
      text: 'Bhai yeh saree kitne ki hai? 😍',
      category: 'inquiry',
      action: 'kept',
      postedAt: '2m ago',
    },
    {
      id: crypto.randomUUID(),
      author: 'Crypto Deals',
      handle: '@get_rich_fast',
      text: 'Make ₹50,000/day! Link in bio 🚀💰',
      category: 'spam',
      action: 'deleted',
      postedAt: '8m ago',
    },
    {
      id: crypto.randomUUID(),
      author: 'Anonymous',
      handle: '@hater_99',
      text: 'Your products are trash, worst seller ever',
      category: 'abuse',
      action: 'hidden',
      postedAt: '12m ago',
    },
    {
      id: crypto.randomUUID(),
      author: 'Rahul Verma',
      handle: '@rahulv',
      text: 'Loved my order, thank you so much! ❤️',
      category: 'genuine',
      action: 'kept',
      postedAt: '20m ago',
    },
    {
      id: crypto.randomUUID(),
      author: 'Sneha',
      handle: '@sneha.boutique',
      text: 'Do you ship to Pune? And COD available?',
      category: 'inquiry',
      action: 'pending',
      postedAt: '35m ago',
    },
    {
      id: crypto.randomUUID(),
      author: 'FollowBot',
      handle: '@free_followers_now',
      text: 'Get 10k followers instantly 👉 cheapsmm.xyz',
      category: 'spam',
      action: 'deleted',
      postedAt: '1h ago',
    },
  ];
}
