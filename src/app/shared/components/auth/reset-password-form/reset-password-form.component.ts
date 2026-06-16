import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

@Component({
  selector: 'app-reset-password-form',
  imports: [LabelComponent, ButtonComponent, InputFieldComponent, RouterModule, FormsModule],
  templateUrl: './reset-password-form.component.html',
  styles: ``,
})
export class ResetPasswordFormComponent {
  email = '';
  submitted = false;
  loading = false;
  sent = false;

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return 'Enter a valid email address.';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailError) return;

    // Frontend-only stub: the backend phase sends the actual reset email.
    this.loading = true;
    this.sent = true;
    this.loading = false;
  }
}
