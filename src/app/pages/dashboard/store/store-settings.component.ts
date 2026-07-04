import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { TextAreaComponent } from '../../../shared/components/form/input/text-area.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { StoreService, StoreSettings } from './store.service';

/** All-strings form shape (the API model allows null; we coerce null↔''). */
interface SettingsForm {
  storeName: string;
  slug: string;
  bio: string;
  logoUrl: string;
  instagram: string;
  whatsapp: string;
  youtube: string;
  twitter: string;
  isActive: boolean;
}

@Component({
  selector: 'app-store-settings',
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    ButtonComponent,
  ],
  templateUrl: './store-settings.component.html',
})
export class StoreSettingsComponent implements OnInit {
  private readonly store = inject(StoreService);

  loading = true;
  submitted = false;
  saving = false;
  saved = false;
  error = '';
  form: SettingsForm = emptyForm();

  ngOnInit(): void {
    this.store.getSettings().subscribe({
      next: (s) => {
        if (s) this.form = toForm(s);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get publicUrl(): string {
    return `${window.location.origin}/s/${this.form.slug || 'your-store'}`;
  }

  get nameError(): string {
    if (!this.submitted) return '';
    return this.form.storeName.trim().length >= 2 ? '' : 'Store name is required.';
  }

  get slugError(): string {
    if (!this.submitted) return '';
    return /^[a-z0-9-]{3,40}$/.test(this.form.slug)
      ? ''
      : 'Use 3-40 lowercase letters, numbers, or hyphens.';
  }

  save(): void {
    this.submitted = true;
    this.saved = false;
    this.error = '';
    if (this.nameError || this.slugError) return;
    this.saving = true;
    this.store.saveSettings(this.form as StoreSettings).subscribe({
      next: (s) => {
        this.form = toForm(s);
        this.saving = false;
        this.saved = true;
      },
      error: (err: unknown) => {
        this.saving = false;
        this.error =
          err instanceof HttpErrorResponse && typeof err.error?.message === 'string'
            ? err.error.message
            : 'Could not save your store settings.';
      },
    });
  }
}

function emptyForm(): SettingsForm {
  return {
    storeName: '',
    slug: '',
    bio: '',
    logoUrl: '',
    instagram: '',
    whatsapp: '',
    youtube: '',
    twitter: '',
    isActive: false,
  };
}

function toForm(s: StoreSettings): SettingsForm {
  return {
    storeName: s.storeName,
    slug: s.slug,
    bio: s.bio ?? '',
    logoUrl: s.logoUrl ?? '',
    instagram: s.instagram ?? '',
    whatsapp: s.whatsapp ?? '',
    youtube: s.youtube ?? '',
    twitter: s.twitter ?? '',
    isActive: s.isActive,
  };
}
