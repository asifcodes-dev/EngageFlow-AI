import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PageHeaderComponent } from '../../../shared/components/common/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { InstagramService } from '../../../shared/services/instagram.service';
import { AuthService } from '../../../shared/services/auth.service';

type Tab = 'profile' | 'instagram' | 'security';

interface SecurityForm {
  current: string;
  next: string;
  confirm: string;
}

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
    ButtonComponent,
    BadgeComponent,
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

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'My details' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'security', label: 'Security' },
  ];
  activeTab: Tab = 'profile';

  // ── Profile form ──────────────────────────────────────────────
  profile: Profile = { fullName: '', dob: '', email: '', phone: '' };
  profileSubmitted = false;
  profileSaving = false;
  profileSaved = false;

  // ── Security form ─────────────────────────────────────────────
  security: SecurityForm = { current: '', next: '', confirm: '' };
  securitySubmitted = false;
  securitySaved = false;

  // ── Instagram ─────────────────────────────────────────────────
  igLoading = false;
  igError = '';
  justConnected = false;

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

  // Security validation
  get nextError(): string {
    if (!this.securitySubmitted) return '';
    return this.security.next.length >= 8 ? '' : 'Use at least 8 characters.';
  }
  get confirmError(): string {
    if (!this.securitySubmitted) return '';
    if (!this.security.confirm) return 'Please confirm your new password.';
    return this.security.next === this.security.confirm ? '' : 'Passwords do not match.';
  }

  saveSecurity(): void {
    this.securitySubmitted = true;
    this.securitySaved = false;
    if (!this.security.current || this.nextError || this.confirmError) return;
    // Backend change-password endpoint wires in later.
    this.securitySaved = true;
    this.security = { current: '', next: '', confirm: '' };
    this.securitySubmitted = false;
  }

  async connectInstagram(): Promise<void> {
    this.igLoading = true;
    this.igError = '';
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
}
