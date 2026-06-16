import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

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

  private router = inject(Router);

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
    if (
      this.fnameError ||
      this.lnameError ||
      this.emailError ||
      this.passwordError ||
      this.termsError
    ) {
      return;
    }

    // Frontend-only stub: real account creation is wired in the backend phase.
    this.loading = true;
    this.router.navigate(['/dashboard']);
  }

  onOAuth(provider: 'google' | 'instagram') {
    // Frontend-only stub for the OAuth providers; backend handles the real flow later.
    console.log('OAuth sign-up requested:', provider);
    this.router.navigate(['/dashboard']);
  }
}
