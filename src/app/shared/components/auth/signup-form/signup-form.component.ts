import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../services/auth.service';
import { GoogleIdentityService } from '../../../services/google-identity.service';
import { environment } from '../../../../../environments/environment';
import { extractAuthError } from '../signin-form/signin-form.component';

@Component({
  selector: 'app-signup-form',
  imports: [LabelComponent, CheckboxComponent, InputFieldComponent, RouterModule, FormsModule],
  templateUrl: './signup-form.component.html',
  styles: ``,
})
export class SignupFormComponent {
  showPassword = false;
  isChecked = false;

  fname = '';
  lname = '';
  email = '';
  password = '';

  submitted = false;
  loading = false;
  errorMessage = '';
  infoMessage = '';

  private router = inject(Router);
  private auth = inject(AuthService);
  private googleAuth = inject(GoogleIdentityService);

  get fnameError(): string {
    if (!this.submitted) return '';
    return this.fname.trim() ? '' : 'First name is required.';
  }

  get lnameError(): string {
    if (!this.submitted) return '';
    return this.lname.trim() ? '' : 'Last name is required.';
  }

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password) return 'Password is required.';
    if (this.password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  get termsError(): string {
    if (!this.submitted) return '';
    return this.isChecked ? '' : 'Please accept the Terms and Privacy Policy.';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    this.submitted = true;
    this.errorMessage = '';
    this.infoMessage = '';
    if (
      this.fnameError ||
      this.lnameError ||
      this.emailError ||
      this.passwordError ||
      this.termsError
    ) {
      return;
    }

    this.loading = true;
    this.auth
      .register({
        firstName: this.fname.trim(),
        lastName: this.lname.trim(),
        email: this.email.trim(),
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err: unknown) => {
          this.loading = false;
          this.errorMessage = extractAuthError(
            err,
            'Unable to create your account. Please try again.',
          );
        },
      });
  }

  onOAuth() {
    this.errorMessage = '';
    this.infoMessage = '';

    const clientId = environment.googleClientId;
    if (!clientId) {
      this.infoMessage = 'Google sign-up isn’t configured yet — please use email and password.';
      return;
    }

    this.loading = true;
    this.googleAuth
      .getCredential(clientId)
      .then((credential) => {
        this.auth.loginWithGoogle(credential).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          },
          error: (err: unknown) => {
            this.loading = false;
            this.errorMessage = extractAuthError(err, 'Google sign-up failed. Please try again.');
          },
        });
      })
      .catch((err: unknown) => {
        this.loading = false;
        this.errorMessage = err instanceof Error ? err.message : 'Google sign-up failed.';
      });
  }
}
