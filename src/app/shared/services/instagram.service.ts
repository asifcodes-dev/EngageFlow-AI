import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
