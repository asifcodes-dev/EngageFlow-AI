import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import {
  AnalyticsService,
  ModeratedCommentEntry,
} from '../../../shared/services/analytics.service';

export type CommentCategory = 'genuine' | 'inquiry' | 'spam' | 'abuse';
export type CommentAction = 'kept' | 'hidden' | 'deleted' | 'pending';
export type ModeratedComment = ModeratedCommentEntry;

/**
 * Comment Guard activity feed backed by `GET {apiUrl}/analytics/moderation` — a
 * read-only record of what the automation already did (delete spam/abuse, keep
 * genuine/inquiry). Empty until the automation runs; `catchError` → empty list.
 */
@Injectable({ providedIn: 'root' })
export class CommentGuardService {
  private readonly analytics = inject(AnalyticsService);

  private readonly subject = new BehaviorSubject<ModeratedComment[]>([]);
  readonly comments$: Observable<ModeratedComment[]> = this.subject.asObservable();

  load(): Observable<ModeratedComment[]> {
    return this.analytics.getModeration().pipe(
      tap((comments) => this.subject.next(comments)),
      catchError(() => {
        this.subject.next([]);
        return of([]);
      }),
    );
  }
}
