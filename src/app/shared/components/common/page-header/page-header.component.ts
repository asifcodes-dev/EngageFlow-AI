import { Component, Input } from '@angular/core';

/**
 * Standard page header: title + optional subtitle on the left, projected
 * actions (buttons, filters) on the right. Keeps every dashboard page aligned.
 */
@Component({
  selector: 'app-page-header',
  imports: [],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h2>
        @if (subtitle) {
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        }
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
