import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

export type ButtonVariant = 'primary' | 'outline' | 'white' | 'danger' | 'ghost';

@Component({
  selector: 'app-button',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './button.component.html',
  styles: ``,
  host: {},
})
export class ButtonComponent {
  @Input() size: 'sm' | 'md' = 'md';
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() className = '';
  @Input() startIcon?: string; // SVG or icon class, or use ng-content for more flexibility
  @Input() endIcon?: string;

  @Output() btnClick = new EventEmitter<Event>();

  get sizeClasses(): string {
    return this.size === 'sm'
      ? 'px-4 py-2.5 text-sm font-semibold'
      : 'px-5 py-3 text-sm font-semibold';
  }

  get variantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'grad-btn text-white disabled:opacity-60';
      case 'white':
        return 'bg-white text-brand-600 shadow-theme-xs hover:bg-brand-50';
      case 'danger':
        return 'bg-error-500 text-white hover:bg-error-600';
      case 'ghost':
        return 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400';
      case 'outline':
      default:
        return 'border bg-[var(--au-surface)] text-gray-700 hover:border-brand-500 hover:text-brand-500 dark:text-gray-300';
    }
  }

  get disabledClasses(): string {
    return this.disabled ? 'cursor-not-allowed opacity-50' : '';
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}
