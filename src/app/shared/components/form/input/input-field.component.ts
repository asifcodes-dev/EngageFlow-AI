import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule],
  template: `
    <div class="relative">
      <input
        [type]="type"
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [ngClass]="inputClasses"
        (input)="onInput($event)"
      />

      @if (hint) {
        <p
          class="mt-1.5 text-xs"
          [ngClass]="{
            'text-error-500': error,
            'text-success-500': success,
            'text-gray-500': !error && !success,
          }"
        >
          {{ hint }}
        </p>
      }
    </div>
  `,
})
export class InputFieldComponent {
  @Input() type: string = 'text';
  @Input() id?: string = '';
  @Input() name?: string = '';
  @Input() placeholder?: string = '';
  @Input() value: string | number = '';
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: number;
  @Input() disabled: boolean = false;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() hint?: string;
  @Input() className: string = '';

  @Output() valueChange = new EventEmitter<string | number>();

  /** Aurora spec: 44px, r12, blue focus ring — all from the common `au-input` class. */
  get inputClasses(): string {
    let inputClasses = 'au-input appearance-none';
    if (this.disabled) {
      inputClasses += ' au-input-disabled';
    } else if (this.error) {
      inputClasses += ' au-input-error';
    } else if (this.success) {
      inputClasses += ' au-input-success';
    }
    // Caller overrides always win — keep last.
    return `${inputClasses} ${this.className}`;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(this.type === 'number' ? +input.value : input.value);
  }
}
