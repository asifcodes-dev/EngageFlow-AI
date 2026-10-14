import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../services/auth.service';
import { GoogleIdentityService } from '../../../services/google-identity.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-signin-form',
  imports: [LabelComponent, CheckboxComponent, InputFieldComponent, RouterModule, FormsModule],
  templateUrl: './signin-form.component.html',
  styles: ``,
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;

  email = '';
  password = '';

  submitted = false;
  loading = false;
  errorMessage = '';
  infoMessage = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private googleAuth = inject(GoogleIdentityService);

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password) return 'Password is required.';
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.submitted = true;
    this.errorMessage = '';
    this.infoMessage = '';
    if (this.emailError || this.passwordError) return;

    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = extractAuthError(
          err,
          'Unable to sign in. Please check your credentials and try again.',
        );
      },
    });
  }

  onOAuth() {
    this.errorMessage = '';
    this.infoMessage = '';

    const clientId = environment.googleClientId;
    if (!clientId) {
      this.infoMessage = 'Google sign-in isn’t configured yet — please use email and password.';
      return;
    }

    this.loading = true;
    this.googleAuth
      .getCredential(clientId)
      .then((credential) => {
        this.auth.loginWithGoogle(credential).subscribe({
          next: () => {
            this.loading = false;
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
            this.router.navigateByUrl(returnUrl);
          },
          error: (err: unknown) => {
            this.loading = false;
            this.errorMessage = extractAuthError(err, 'Google sign-in failed. Please try again.');
          },
        });
      })
      .catch((err: unknown) => {
        this.loading = false;
        this.errorMessage = err instanceof Error ? err.message : 'Google sign-in failed.';
      });
  }
}

/** Pulls a human-readable message out of an HTTP error, with a sensible fallback. */
export function extractAuthError(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'Cannot reach the server. Please try again in a moment.';
    }
    const message = err.error?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  }
  return fallback;
}
