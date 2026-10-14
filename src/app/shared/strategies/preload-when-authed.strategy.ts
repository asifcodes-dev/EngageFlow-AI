import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

const TOKEN_KEY = 'ef_auth_token';

/**
 * Preload lazy route chunks ONLY for signed-in users. Anonymous landing-page
 * visitors stay light (no background dashboard download); once a JWT is present,
 * dashboard chunks prefetch after first paint so navigation feels instant.
 * Never preloads during prerendering (build-time, Node — no localStorage).
 */
@Injectable({ providedIn: 'root' })
export class PreloadWhenAuthedStrategy implements PreloadingStrategy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!this.isBrowser) return of(null);
    return localStorage.getItem(TOKEN_KEY) ? load() : of(null);
  }
}
