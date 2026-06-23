import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Wraps a feature's content and, when `locked`, dims/blurs it behind a centered
 * "Connect Instagram to unlock" card. The lock is UX only — the real gate is the
 * backend. Content is always projected once; only the overlay is conditional.
 */
@Component({
  selector: 'app-feature-lock',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative">
      <div
        [ngClass]="{
          'pointer-events-none max-h-[70vh] select-none overflow-hidden opacity-50 blur-sm': locked,
        }"
        [attr.aria-hidden]="locked ? 'true' : null"
      >
        <ng-content></ng-content>
      </div>

      @if (locked) {
        <div class="absolute inset-0 z-10 flex items-start justify-center px-4 pt-12 sm:pt-20">
          <div class="ef-card w-full max-w-md p-6 text-center shadow-theme-lg sm:p-8" role="status">
            <span
              class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                class="h-7 w-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3m-1 0h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-6A1.5 1.5 0 0 1 6.5 12Z"
                />
              </svg>
            </span>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
            <p class="mx-auto mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {{ message }}
            </p>
            <a
              routerLink="/dashboard/settings"
              [queryParams]="{ tab: 'instagram' }"
              class="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              {{ ctaLabel }}
            </a>
          </div>
        </div>
      }
    </div>
  `,
})
export class FeatureLockComponent {
  @Input() locked = false;
  @Input() title = 'Connect Instagram to unlock';
  @Input() message =
    'This feature runs on your Instagram account. Connect one to start automating replies, DMs, and moderation.';
  @Input() ctaLabel = 'Connect Instagram';
}
