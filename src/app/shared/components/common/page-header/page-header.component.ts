import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Aurora page header: optional eyebrow + H1 + subtitle on the left, projected
 * actions (buttons, filters) on the right, closed by a bottom rule. Pair with
 * <app-page-breadcrumb> for the eyebrow, or pass `eyebrow` directly.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 border-b pb-4" style="border-color: var(--au-line)">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          @if (eyebrow) {
            <div [ngClass]="eyebrowTone === 'violet' ? 'au-eyebrow-violet' : 'au-eyebrow'">
              {{ eyebrow }}
            </div>
          }
          <h1
            class="mt-1.5 text-[22px] font-bold tracking-[-0.02em] text-gray-900 sm:text-[26px] dark:text-white"
          >
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="mt-1.5 text-sm" style="color: var(--au-muted)">{{ subtitle }}</p>
          }
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() eyebrow = '';
  @Input() eyebrowTone: 'brand' | 'violet' = 'brand';
  @Input() title = '';
  @Input() subtitle = '';
}
