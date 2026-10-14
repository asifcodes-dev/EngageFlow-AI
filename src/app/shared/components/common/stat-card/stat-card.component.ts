import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

export type ChipColor = 'blue' | 'green' | 'purple' | 'amber' | 'yellow' | 'red' | 'grey';
export type TrendColor = 'success' | 'error' | 'warning' | 'info' | 'primary';

/**
 * Aurora KPI card — uppercase label + colored icon chip header, big number with
 * an optional delta pill, and a sub line. `highlight` renders the inverted
 * gradient card (one per KPI row, e.g. Revenue / Available). Lift + shimmer on
 * hover. Existing inputs kept; `chipColor`/`highlight`/`tag` are additive.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div
      class="lift shine"
      [ngClass]="compact ? 'px-4.5 py-4.25' : 'px-5 py-4.5'"
      [class.au-card]="!highlight"
      [class.au-kpi-highlight]="highlight"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="au-kpi-label" [class.!text-white/80]="highlight">{{ label }}</span>
        @if (highlight) {
          @if (tag) {
            <span class="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
              {{ tag }}
            </span>
          }
        } @else if (locked) {
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
        } @else if (icon) {
          <span
            class="au-chip"
            [ngClass]="['au-chip-' + chipColor, compact ? 'h-8 w-8 rounded-[10px]' : '']"
            [innerHTML]="icon | safeHtml"
          ></span>
        }
      </div>

      <div class="mt-3 flex items-baseline gap-2.5">
        <span
          class="font-bold leading-none tracking-[-0.02em]"
          [ngClass]="[
            compact ? 'text-[25px]' : 'text-[28px]',
            muted && !highlight ? 'text-gray-500' : '',
          ]"
          [class.text-white]="highlight"
          [class.text-gray-800]="!highlight && !muted"
          [class.dark:text-white]="!highlight && !muted"
          >{{ value }}</span
        >
        @if (trend && !highlight) {
          <span class="au-pill" [ngClass]="pillClass">{{ trend }}</span>
        }
      </div>

      @if (hint) {
        <div
          class="mt-1.5 text-[12px]"
          [class.text-white/80]="highlight"
          [class.text-gray-500]="!highlight"
        >
          {{ hint }}
        </div>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() hint = '';
  @Input() trend = '';
  @Input() trendColor: TrendColor = 'success';
  @Input() chipColor: ChipColor = 'blue';
  @Input() highlight = false;
  /** Small pill shown top-right on highlight cards (e.g. "paid only", "live"). */
  @Input() tag = '';
  @Input() locked = false;
  /** Compact 5-up variant (Earnings): 25px value, 32px chip, tighter padding. */
  @Input() compact = false;
  /** Grey value treatment (e.g. the negative platform-fee figure). */
  @Input() muted = false;

  get pillClass(): string {
    switch (this.trendColor) {
      case 'error':
        return 'au-pill-red';
      case 'warning':
        return 'au-pill-amber';
      case 'info':
      case 'primary':
        return 'au-pill-blue';
      default:
        return 'au-pill-green';
    }
  }
}
