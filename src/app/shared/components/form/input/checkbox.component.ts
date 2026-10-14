import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule],
  template: `
    <label
      class="group flex cursor-pointer items-center gap-3"
      [ngClass]="{ 'cursor-not-allowed opacity-60': disabled }"
    >
      <input
        [id]="id"
        type="checkbox"
        class="sr-only"
        [checked]="checked"
        (change)="onChange($event)"
        [disabled]="disabled"
      />
      <!-- Aurora 18px checkbox (common au-checkbox classes) -->
      <span class="au-checkbox" [ngClass]="[checked ? 'au-checkbox-on' : '', className]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      @if (label) {
        <span class="text-sm font-medium text-(--au-ink)">
          {{ label }}
        </span>
      }
    </label>
  `,
  styles: ``,
})
export class CheckboxComponent {
  @Input() label?: string;
  @Input() checked = false;
  @Input() className = '';
  @Input() id?: string;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
