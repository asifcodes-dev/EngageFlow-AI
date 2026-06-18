import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
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

  onOAuth(provider: 'google' | 'instagram') {
    // OAuth is not wired yet; the backend social-login flow comes in a later phase.
    this.errorMessage = '';
    this.infoMessage = `${provider === 'google' ? 'Google' : 'Instagram'} sign-in is coming soon — please use email and password for now.`;
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
