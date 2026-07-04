import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { StoreCategory, StoreService } from './store.service';

@Component({
  selector: 'app-store-categories',
  imports: [CommonModule, FormsModule, LabelComponent, InputFieldComponent, ButtonComponent],
  templateUrl: './store-categories.component.html',
})
export class StoreCategoriesComponent implements OnInit {
  private readonly store = inject(StoreService);

  categories: StoreCategory[] = [];
  loading = true;
  name = '';
  creating = false;
  error = '';

  ngOnInit(): void {
    this.store.listCategories().subscribe({
      next: (c) => {
        this.categories = c;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  add(): void {
    const name = this.name.trim();
    if (!name || this.creating) return;
    this.creating = true;
    this.error = '';
    this.store.createCategory(name).subscribe({
      next: (c) => {
        this.categories = [...this.categories, c].sort((a, b) => a.name.localeCompare(b.name));
        this.name = '';
        this.creating = false;
      },
      error: (err: unknown) => {
        this.creating = false;
        this.error =
          err instanceof HttpErrorResponse && typeof err.error?.message === 'string'
            ? err.error.message
            : 'Could not create the category.';
      },
    });
  }

  remove(cat: StoreCategory): void {
    this.store.removeCategory(cat.id).subscribe({
      next: () => (this.categories = this.categories.filter((c) => c.id !== cat.id)),
      error: () => undefined,
    });
  }
}
