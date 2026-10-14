import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { InstagramService } from '../../../shared/services/instagram.service';
import { AuthService } from '../../../shared/services/auth.service';

type Tab = 'profile' | 'instagram' | 'security';

interface Profile {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    PageHeaderComponent,
    LabelComponent,
    InputFieldComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly instagram = inject(InstagramService);
  private readonly connection = inject(ConnectionStateService);
  private readonly auth = inject(AuthService);

  readonly connected$ = this.connection.connected$;
  readonly username$ = this.connection.username$;

  readonly tabs: { id: Tab; label: string; short: string }[] = [
    { id: 'profile', label: 'My details', short: 'Details' },
    { id: 'instagram', label: 'Instagram', short: 'Instagram' },
    { id: 'security', label: 'Security', short: 'Security' },
  ];
  activeTab: Tab = 'profile';

  // ── Profile form ──────────────────────────────────────────────
  profile: Profile = { fullName: '', dob: '', email: '', phone: '' };
  profileSubmitted = false;
  profileSaving = false;
  profileSaved = false;

  // ── Security (change-password stub + 2FA stub — backend wires later) ──
  newPassword = '';
  showNewPassword = false;
  securitySubmitted = false;
  securitySaved = false;
  twoFAEnabled = false;

  /** Live password-strength score (reference: 4 checks → 25% steps). */
  get passwordStrength(): { pct: number; label: string; color: string } {
    const p = this.newPassword;
    if (!p)
      return {
        pct: 0,
        label: 'At least 8 characters, mix cases & numbers.',
        color: 'var(--au-track)',
      };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const pct = Math.max(12, (score / 4) * 100);
    if (score <= 1) return { pct, label: 'Weak password', color: '#9aa1ab' };
    if (score <= 3) return { pct, label: 'Okay — add symbols to strengthen', color: '#1a5dab' };
    return { pct, label: 'Strong password', color: '#2d7a4f' };
  }

  // ── Instagram ─────────────────────────────────────────────────
  igLoading = false;
  igError = '';
  igNote = '';
  justConnected = false;
  igDisconnecting = false;
  confirmDisconnect = false;

  constructor() {
    const tab = this.route.snapshot.queryParamMap.get('tab') as Tab | null;
    if (tab === 'instagram' || tab === 'security') {
      this.activeTab = tab;
    }

    // Returning from the Instagram OAuth flow (backend redirect).
    const igResult = this.route.snapshot.queryParamMap.get('instagram');
    if (igResult === 'connected') {
      this.justConnected = true;
      this.connection.refresh(); // re-check server status so the lock flips
    } else if (igResult === 'error') {
      this.activeTab = 'instagram';
      this.igError = 'We could not connect your Instagram account. Please try again.';
    }

    // Prefill entirely from the real signed-in user (GET /auth/me) — no seed data.
    this.auth.me().subscribe({
      next: (user) => {
        this.profile = {
          fullName: user.name ?? '',
          dob: user.dateOfBirth ?? '',
          email: user.email,
          phone: user.phone ?? '',
        };
      },
      error: () => {
        /* not signed in / offline — leave the empty form */
      },
    });
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  // Profile validation
  get fullNameError(): string {
    if (!this.profileSubmitted) return '';
    return this.profile.fullName.trim() ? '' : 'Full name is required.';
  }
  get emailError(): string {
    if (!this.profileSubmitted) return '';
    const v = this.profile.email.trim();
    if (!v) return 'Email is required.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.';
  }
  get phoneError(): string {
    if (!this.profileSubmitted) return '';
    const v = this.profile.phone.trim();
    if (!v) return '';
    return /^[0-9+\-\s]{7,15}$/.test(v) ? '' : 'Enter a valid phone number.';
  }

  saveProfile(): void {
    this.profileSubmitted = true;
    this.profileSaved = false;
    if (this.fullNameError || this.emailError || this.phoneError) return;
    this.profileSaving = true;
    // Email is not self-editable; persist name/DOB/phone via PATCH /auth/profile.
    this.auth
      .updateProfile({
        name: this.profile.fullName.trim(),
        dateOfBirth: this.profile.dob,
        phone: this.profile.phone.trim(),
      })
      .subscribe({
        next: () => {
          this.profileSaving = false;
          this.profileSaved = true;
        },
        error: () => {
          this.profileSaving = false;
        },
      });
  }

  // Security (stub — backend change-password endpoint wires in later)
  get newPasswordError(): string {
    if (!this.securitySubmitted) return '';
    return this.newPassword.length >= 8 ? '' : 'Use at least 8 characters.';
  }

  saveSecurity(): void {
    this.securitySubmitted = true;
    this.securitySaved = false;
    if (this.newPasswordError) return;
    this.securitySaved = true;
    this.newPassword = '';
    this.securitySubmitted = false;
  }

  async connectInstagram(): Promise<void> {
    this.igLoading = true;
    this.igError = '';
    this.igNote = '';
    try {
      const { url } = await this.instagram.getConnectUrl();
      window.location.href = url;
    } catch (err: unknown) {
      this.igLoading = false;
      this.igError =
        err instanceof HttpErrorResponse && err.status === 401
          ? 'Please sign in first, then connect your Instagram account.'
          : 'Could not start the Instagram connection. Please try again.';
    }
  }

  /** Two-step disconnect: first click asks to confirm, second click executes. */
  disconnectInstagram(): void {
    this.igError = '';
    if (!this.confirmDisconnect) {
      this.confirmDisconnect = true;
      this.igNote =
        'Disconnecting deletes the stored connection (including access tokens) and removes Instagram-derived data from your analytics. Click again to confirm.';
      return;
    }
    this.confirmDisconnect = false;
    this.igDisconnecting = true;
    this.igNote = '';
    this.instagram.disconnect().subscribe({
      next: () => {
        this.igDisconnecting = false;
        this.justConnected = false;
        this.igNote = 'Instagram disconnected — its data has been deleted.';
        this.connection.refresh(); // server-truth: flips the feature lock
      },
      error: () => {
        this.igDisconnecting = false;
        this.igError = 'Could not disconnect right now. Please try again.';
      },
    });
  }
}
