import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { ButtonComponent } from '../../ui/button/button.component';

/**
 * Reusable empty-state block (icon + title + text + optional CTA). Generalises
 * the inline pattern previously duplicated in the product-catalog page.
 */
@Component({
  selector: 'app-empty-state',
  imports: [CommonModule, SafeHtmlPipe, ButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span class="ef-icon-box mb-4 h-14 w-14 text-brand-500" [innerHTML]="icon | safeHtml"></span>
      <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
      @if (description) {
        <p class="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
      }
      @if (ctaText) {
        <div class="mt-5">
          <app-button size="sm" (btnClick)="cta.emit()">{{ ctaText }}</app-button>
        </div>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() description = '';
  @Input() ctaText = '';
  /** Inline SVG markup; defaults to a neutral document/list glyph. */
  @Input() icon =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-7 w-7"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>`;

  @Output() cta = new EventEmitter<void>();
}
