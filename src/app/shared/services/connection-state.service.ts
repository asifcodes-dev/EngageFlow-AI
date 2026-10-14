import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InstagramService } from './instagram.service';

/**
 * Single source of truth for whether the subscriber has a connected Instagram
 * account — the flag that locks/unlocks every Instagram-dependent feature.
 *
 * The value is SERVER-TRUTH: it is read from the backend (`instagram.getStatus()`),
 * never from a client-writable store, so a user cannot unlock features just by
 * editing localStorage. The client lock is a UX affordance only — real access is
 * enforced server-side on the feature/Graph endpoints.
 *
 * `environment.previewUnlocked` (compiled-in, default false) lets a developer
 * preview the unlocked UI before the backend status endpoint exists.
 */
@Injectable({ providedIn: 'root' })
export class ConnectionStateService {
  private readonly instagram = inject(InstagramService);

  private readonly connectedSubject = new BehaviorSubject<boolean>(
    environment.previewUnlocked === true,
  );
  private readonly usernameSubject = new BehaviorSubject<string | null>(null);

  /** Emits `true` once a connected Instagram account is confirmed by the backend. */
  readonly connected$: Observable<boolean> = this.connectedSubject.asObservable();
  /** Connected IG handle (without @), or null — for "@handle · Connected" pills. */
  readonly username$: Observable<string | null> = this.usernameSubject.asObservable();

  constructor() {
    this.refresh();
  }

  get connected(): boolean {
    return this.connectedSubject.value;
  }

  /** Re-check connection status from the backend (the source of truth). */
  refresh(): void {
    if (environment.previewUnlocked) {
      this.connectedSubject.next(true);
      return;
    }
    this.instagram
      .getStatus()
      .pipe(
        map((status) => ({ connected: status.connected, username: status.username ?? null })),
        // No endpoint yet / not connected / auth issue → treat as locked.
        catchError(() => of({ connected: false, username: null })),
      )
      .subscribe(({ connected, username }) => {
        this.connectedSubject.next(connected);
        this.usernameSubject.next(username);
      });
  }
}
