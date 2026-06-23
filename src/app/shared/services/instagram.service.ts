import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Connection status as reported by the backend (server-truth). */
export interface InstagramStatus {
  connected: boolean;
  username?: string;
}

/**
 * Kicks off the Instagram account-connect flow. The backend (JWT-guarded
 * GET /instagram/connect) returns the Meta OAuth consent URL; the browser is
 * then redirected there, and Meta redirects back to the backend callback.
 */
@Injectable({ providedIn: 'root' })
export class InstagramService {
  private http = inject(HttpClient);

  getConnectUrl(): Promise<{ url: string }> {
    return firstValueFrom(
      this.http.get<{ url: string }>(`${environment.apiUrl}/instagram/connect`),
    );
  }

  /**
   * Whether a connected Instagram account exists. Backed by a future
   * `GET /instagram/status` endpoint; until it ships, the call simply fails and
   * callers treat the user as not connected.
   */
  getStatus(): Observable<InstagramStatus> {
    return this.http.get<InstagramStatus>(`${environment.apiUrl}/instagram/status`);
  }
}
