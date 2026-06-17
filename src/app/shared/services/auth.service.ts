import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Shape returned by the auth endpoints. Token field name is read leniently
 * (access_token / accessToken / token) so this survives small backend changes.
 */
interface AuthResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: AuthUser;
}

const TOKEN_KEY = 'ef_auth_token';

/**
 * Single integration point for the EngageFlow backend Auth (JWT) module.
 *
 * Backend contract (must match the NestJS Auth controller):
 *   POST {apiUrl}/auth/register  { firstName, lastName, email, password } -> { access_token, user? }
 *   POST {apiUrl}/auth/login     { email, password }                      -> { access_token, user? }
 *   GET  {apiUrl}/auth/me        (Bearer token)                           -> AuthUser
 *
 * When the backend's final routes/field names are known, adjust them here only.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private readonly authUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/register`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/login`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  /** Fetch the authenticated user (e.g. on app start to restore the session). */
  loadCurrentUser(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(`${this.authUrl}/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuth(res: AuthResponse): void {
    const token = res.access_token ?? res.accessToken ?? res.token ?? null;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (res.user) {
      this.currentUserSubject.next(res.user);
    }
  }
}
