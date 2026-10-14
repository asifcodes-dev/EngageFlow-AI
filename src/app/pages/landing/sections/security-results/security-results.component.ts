import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Trust {
  icon: string;
  bg: string;
  label: string;
}
interface Result {
  icon: string;
  bg: string;
  value: string;
  label: string;
}

/** Trust & safety + typical-results card (marketing LP reference). */
@Component({
  selector: 'app-landing-security-results',
  imports: [CommonModule, SafeHtmlPipe, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="scroll-mt-20 border-t border-gray-100 ef-section dark:border-gray-800">
      <div class="ef-container">
        <div
          appReveal
          class="lift relative mx-auto grid max-w-240 grid-cols-1 items-center gap-8 overflow-hidden rounded-[22px] border border-[#eef1f6] bg-white p-6 shadow-[0_12px_34px_-20px_rgba(20,40,80,0.3)] sm:p-8 md:grid-cols-[1fr_1px_1fr] dark:border-gray-800 dark:bg-gray-900"
        >
          <span
            aria-hidden="true"
            class="au-blob"
            style="width:260px;height:260px;background:rgba(36,112,200,.1);top:-120px;left:-40px;filter:blur(70px)"
          ></span>

          <!-- Trust -->
          <div class="relative">
            <div class="ef-eyebrow">Trust &amp; safety</div>
            <div class="mt-2 mb-4 text-xl font-extrabold text-gray-900 dark:text-white">
              Your data stays protected
            </div>
            <div class="flex flex-col gap-[13px]">
              @for (t of trust; track t.label) {
                <div class="flex items-center gap-[11px]">
                  <span
                    class="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] md:h-[38px] md:w-[38px]"
                    [style.background]="t.bg"
                    [innerHTML]="t.icon | safeHtml"
                  ></span>
                  <span class="text-[13px] text-gray-700 dark:text-gray-300">{{ t.label }}</span>
                </div>
              }
            </div>
          </div>

          <div class="my-4 h-px bg-[#eef1f6] md:hidden dark:bg-gray-800"></div>

          <span class="hidden h-full w-px bg-[#eef1f6] md:block dark:bg-gray-800"></span>

          <!-- Results -->
          <div class="relative">
            <div class="text-xs font-bold tracking-[0.12em] text-[#8894a8] uppercase">
              Typical results · 30 days
            </div>
            <div class="mt-3.5 grid grid-cols-2 gap-4.5">
              @for (r of results; track r.label) {
                <div>
                  <span
                    class="mb-2 grid h-7.5 w-7.5 place-items-center rounded-[9px]"
                    [style.background]="r.bg"
                    [innerHTML]="r.icon | safeHtml"
                  ></span>
                  <div class="text-[28px] font-extrabold text-[#171717] dark:text-white">
                    {{ r.value }}
                  </div>
                  <div class="text-[11.5px] text-gray-500 dark:text-gray-400">{{ r.label }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SecurityResultsComponent {
  private icon(stroke: string, path: string): string {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }
  private ricon(stroke: string, path: string): string {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  readonly trust: Trust[] = [
    {
      bg: 'linear-gradient(135deg,#e8f0fb,#d6e6fa)',
      icon: this.icon('#1a5dab', '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />'),
      label: 'Official Meta APIs — never your password',
    },
    {
      bg: 'linear-gradient(135deg,#e8f8ef,#d5f2e2)',
      icon: this.icon(
        '#2d7a4f',
        '<rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />',
      ),
      label: 'Encrypted & private',
    },
    {
      bg: 'linear-gradient(135deg,#f0ecfb,#e5dcf7)',
      icon: this.icon('#5b4a9e', '<circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />'),
      label: 'Disconnect anytime',
    },
  ];

  readonly results: Result[] = [
    {
      bg: '#e8f0fb',
      icon: this.ricon('#1a5dab', '<path d="M13 2 3 14h7l-1 8 10-12h-7z" />'),
      value: '3×',
      label: 'faster replies',
    },
    {
      bg: '#e8f8ef',
      icon: this.ricon('#2d7a4f', '<path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" />'),
      value: '+42%',
      label: 'more leads',
    },
    {
      bg: '#fbebe8',
      icon: this.ricon('#b3402f', '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />'),
      value: '96%',
      label: 'spam removed',
    },
    {
      bg: '#f0ecfb',
      icon: this.ricon('#5b4a9e', '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />'),
      value: '10+ hrs',
      label: 'saved weekly',
    },
  ];
}
