import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Mirrors the backend SafeUser the auth endpoints return (login/register/me),
// so the cached `currentUser$` keeps the real name/role/subscriptionTier.
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role?: string;
  subscriptionTier?: 'PRO' | 'BUSINESS' | null;
}

/** The full user the backend returns from GET /auth/me (SafeUser shape). */
export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  businessName: string | null;
  brandTone: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  role: string;
  subscriptionTier: 'PRO' | 'BUSINESS' | null;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
}

/** Self-editable profile / brand-voice fields (PATCH /auth/profile). */
export interface ProfileUpdate {
  name?: string;
  businessName?: string;
  brandTone?: string;
  phone?: string;
  dateOfBirth?: string;
}

/** Plan usage vs limits from GET /auth/usage (`limit: null` = unlimited). */
export interface PlanUsage {
  tier: 'PRO' | 'BUSINESS' | null;
  /** PRO while on an active trial; the paid tier otherwise; null when locked. */
  effectiveTier: 'PRO' | 'BUSINESS' | null;
  isTrialing: boolean;
  trialDaysLeft: number;
  products: { used: number; limit: number | null };
  flows: { used: number; limit: number | null };
  ai: { used: number; limit: number | null };
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly authUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    // Backend expects a single `name` field (not firstName/lastName) and rejects
    // unknown properties, so combine the two before sending.
    const body = {
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      password: payload.password,
    };
    return this.http
      .post<AuthResponse>(`${this.authUrl}/register`, body)
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

  /** Full backend user (name, role, subscriptionTier, profile) from GET /auth/me. */
  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.authUrl}/me`);
  }

  /** Update self-editable profile / brand-voice fields (PATCH /auth/profile). */
  updateProfile(update: ProfileUpdate): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.authUrl}/profile`, update).pipe(
      tap((user) =>
        this.currentUserSubject.next({
          ...(this.currentUserSubject.value ?? ({} as AuthUser)),
          ...user,
        }),
      ),
    );
  }

  /** Plan usage vs limits (products/flows) from GET /auth/usage. */
  usage(): Observable<PlanUsage> {
    return this.http.get<PlanUsage>(`${this.authUrl}/usage`);
  }

  /** Start the one-time 7-day free trial (POST /auth/start-trial). */
  startTrial(): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.authUrl}/start-trial`, {});
  }

  /** Sign in with a Google ID token credential (Phase 10 social login). */
  loginWithGoogle(credential: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/google`, { credential })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  /** Request a password-reset link for the given email. */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authUrl}/forgot-password`, { email });
  }

  /** Set a new password using the token from the reset link. */
  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authUrl}/reset-password`, {
      token,
      password,
    });
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuth(res: AuthResponse): void {
    const token = res.access_token ?? res.accessToken ?? res.token ?? null;
    if (token && this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (res.user) {
      this.currentUserSubject.next(res.user);
    }
  }
}
