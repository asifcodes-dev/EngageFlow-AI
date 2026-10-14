import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password-form',
  imports: [LabelComponent, InputFieldComponent, RouterModule, FormsModule],
  templateUrl: './reset-password-form.component.html',
  styles: ``,
})
export class ResetPasswordFormComponent {
  private readonly auth = inject(AuthService);

  email = '';
  submitted = false;
  loading = false;
  sent = false;
  error = '';

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return 'Enter a valid email address.';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailError || this.loading) return;

    this.loading = true;
    this.error = '';
    // The backend always responds generically (it won't reveal whether the
    // email exists), so a success simply means "request accepted".
    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.sent = true;
      },
      error: () => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again in a moment.';
      },
    });
  }
}
