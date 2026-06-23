import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { BadgeComponent } from '../../ui/badge/badge.component';

/**
 * KPI tile (icon + label + value, optional trend badge / hint / lock state).
 * Extracted from the ecommerce-metrics pattern so every page reuses one card.
 */
@Component({
  selector: 'app-stat-card',
  imports: [CommonModule, SafeHtmlPipe, BadgeComponent],
  template: `
    <div class="ef-card p-5">
      <div class="flex items-center justify-between">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300"
          [innerHTML]="icon | safeHtml"
        ></span>
        @if (locked) {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            class="h-4 w-4 text-gray-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3m-1 0h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-6A1.5 1.5 0 0 1 6.5 12Z"
            />
          </svg>
        } @else if (trend) {
          <app-badge [color]="trendColor" variant="light" size="sm">{{ trend }}</app-badge>
        }
      </div>
      <div class="mt-4">
        <span class="block text-sm text-gray-500 dark:text-gray-400">{{ label }}</span>
        <h4 class="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90">{{ value }}</h4>
        @if (hint) {
          <span class="mt-1 block text-xs text-gray-400">{{ hint }}</span>
        }
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() hint = '';
  @Input() trend = '';
  @Input() trendColor: 'success' | 'error' | 'warning' | 'info' | 'primary' = 'success';
  @Input() locked = false;
}
