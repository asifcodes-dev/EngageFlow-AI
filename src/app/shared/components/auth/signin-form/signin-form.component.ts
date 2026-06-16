import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

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

  private router = inject(Router);

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
    if (this.emailError || this.passwordError) return;

    // Frontend-only stub: real authentication is wired in the backend phase.
    // For now a successful submit lands the user on the dashboard.
    this.loading = true;
    this.router.navigate(['/dashboard']);
  }

  onOAuth(provider: 'google' | 'instagram') {
    // Frontend-only stub for the OAuth providers; backend handles the real flow later.
    console.log('OAuth sign-in requested:', provider);
    this.router.navigate(['/dashboard']);
  }
}
