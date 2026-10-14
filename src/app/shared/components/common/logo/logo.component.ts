import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Which surface the logo sits on — determines the mark treatment + wordmark tone. */
export type LogoVariant = 'sidebar' | 'topbar' | 'auth' | 'landing' | 'footer' | 'mark';

/**
 * EngageFlow "Aurora" logo — the detailed flow-node mark (mark.png, the hi-res
 * Figma export) paired with the DM Sans wordmark. The mark is sized by HEIGHT
 * with width:auto so its ~1.59:1 aspect is always preserved (never squished into
 * a square). On the blue top bar it sits inside a white rounded chip so the
 * colourful mark reads against the gradient (matches the dashboard reference).
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center" [style.gap.px]="gap">
      @if (variant === 'topbar') {
        <span class="inline-flex shrink-0 items-center rounded-lg bg-white px-1.5 py-1">
          <img
            src="images/logo/mark.png"
            alt=""
            [style.height.px]="markSize"
            class="w-auto select-none"
            loading="eager"
            decoding="async"
          />
        </span>
      } @else if (variant === 'landing') {
        <!-- Sized by WIDTH (height auto) — 60px on desktop reads better in the
             sticky header than the shared height-based sizing used elsewhere. -->
        <img
          src="images/logo/mark.png"
          alt=""
          class="h-auto w-10 shrink-0 select-none sm:w-15"
          loading="eager"
          decoding="async"
        />
      } @else {
        <img
          src="images/logo/mark.png"
          alt=""
          [style.height.px]="markSize"
          class="w-auto shrink-0 select-none"
          loading="eager"
          decoding="async"
        />
      }

      @if (showWordmark) {
        <span class="whitespace-nowrap" [style.font-size.px]="wordSize" [ngClass]="wordClass">
          EngageFlow <span [ngClass]="aiClass" [style.opacity]="aiOpacity">AI</span>
        </span>
      }
    </span>
  `,
})
export class LogoComponent {
  @Input() variant: LogoVariant = 'sidebar';
  @Input() showWordmark = true;

  /** Mark HEIGHT in px — width is auto, preserving the mark's 1.59:1 aspect. */
  get markSize(): number {
    switch (this.variant) {
      case 'topbar':
        return 20;
      case 'auth':
        return 48;
      case 'landing':
      case 'footer':
        return 40;
      case 'mark':
        return 40;
      default:
        return 32; // sidebar
    }
  }

  get gap(): number {
    // Tight gap (the mark PNG carries its own transparent padding). The blue
    // top bar wraps the mark in a white chip, so it needs a touch more room.
    return this.variant === 'topbar' ? 6 : 2;
  }

  get wordSize(): number {
    switch (this.variant) {
      case 'topbar':
        return 17;
      case 'auth':
        return 26;
      case 'landing':
      case 'footer':
        return 21;
      default:
        return 17; // sidebar
    }
  }

  /** Wordmark base color + weight/tracking by surface tone. */
  get wordClass(): string {
    const weight =
      this.variant === 'topbar'
        ? 'font-bold tracking-[-0.01em]'
        : 'font-extrabold tracking-[-0.02em]';
    if (this.variant === 'topbar' || this.variant === 'auth' || this.variant === 'footer') {
      return `${weight} text-white`;
    }
    return `${weight} text-gray-900 dark:text-white`;
  }

  /** "AI" accent color by surface tone. */
  get aiClass(): string {
    if (this.variant === 'topbar') return 'font-medium';
    if (this.variant === 'auth' || this.variant === 'footer') return 'font-semibold text-[#8ea2ff]';
    return 'font-semibold text-brand-500';
  }

  get aiOpacity(): number | null {
    return this.variant === 'topbar' ? 0.85 : null;
  }
}
