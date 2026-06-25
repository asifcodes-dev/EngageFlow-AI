import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

const TOKEN_KEY = 'ef_auth_token';

/**
 * Preload lazy route chunks ONLY for signed-in users. Anonymous landing-page
 * visitors stay light (no background dashboard download); once a JWT is present,
 * dashboard chunks prefetch after first paint so navigation feels instant.
 */
@Injectable({ providedIn: 'root' })
export class PreloadWhenAuthedStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return localStorage.getItem(TOKEN_KEY) ? load() : of(null);
  }
}
