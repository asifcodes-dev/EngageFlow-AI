import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

/** Before vs after EngageFlow — two contrasting cards with a centered VS badge. */
@Component({
  selector: 'app-landing-before-after',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="scroll-mt-20 border-t border-gray-100 ef-section dark:border-gray-800">
      <div class="ef-container">
        <div class="ef-section-head">
          <span class="ef-eyebrow">The difference</span>
          <h2 class="ef-heading">Before vs after EngageFlow</h2>
        </div>

        <div class="relative mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 md:gap-[18px]">
          <!-- VS badge -->
          <span
            aria-hidden="true"
            class="absolute top-1/2 left-1/2 z-[2] grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e3e6eb] bg-white text-[10px] font-extrabold text-[#8894a8] shadow-[0_8px_20px_-10px_rgba(20,40,80,0.4)] md:h-11 md:w-11 md:text-[13px] dark:border-gray-700 dark:bg-gray-900"
          >
            VS
          </span>

          <!-- Manual -->
          <div
            appReveal
            style="--i: 0; background:linear-gradient(180deg,#fdf6f4,#fff)"
            class="lift rounded-[20px] border border-[#f3d9d3] p-[26px] shadow-[0_10px_30px_-18px_rgba(140,40,30,0.25)]"
          >
            <div class="flex items-center gap-[9px] text-base font-extrabold text-[#b3402f]">
              <span
                aria-hidden="true"
                class="grid h-7 w-7 place-items-center rounded-[9px] bg-[#fbe3de]"
                >✕</span
              >
              Doing it manually
            </div>
            <div class="mt-4 flex flex-col">
              @for (item of manual; track item) {
                <div
                  class="flex items-center gap-2.5 border-b border-[#f3e4e0] py-3 text-sm text-[#6b5b58] last:border-0"
                >
                  <span aria-hidden="true" class="font-extrabold text-[#c9564a]">✕</span>{{ item }}
                </div>
              }
            </div>
          </div>

          <!-- With EngageFlow -->
          <div
            appReveal
            style="--i: 1; background:linear-gradient(180deg,#f0fbf5,#fff)"
            class="lift rounded-[20px] border border-[#cdeede] p-[26px] shadow-[0_12px_34px_-18px_rgba(11,138,91,0.35)]"
          >
            <div class="flex items-center gap-[9px] text-base font-extrabold text-[#0b8a5b]">
              <span class="grid h-7 w-7 place-items-center rounded-[9px] bg-[#12b981] text-white">
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              With EngageFlow
            </div>
            <div class="mt-4 flex flex-col">
              @for (item of withEf; track item) {
                <div
                  class="flex items-center gap-2.5 border-b border-[#dcf0e6] py-3 text-sm font-semibold text-[#1c6b45] last:border-0"
                >
                  <svg
                    aria-hidden="true"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#12b981"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="shrink-0"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {{ item }}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BeforeAfterComponent {
  readonly manual = [
    'Replies hours late',
    'Spam piles up',
    'Leads lost in inbox',
    'No sales visibility',
  ];
  readonly withEf = [
    'Replies in <3 seconds',
    'Spam auto-hidden',
    'Every lead captured',
    'Dashboard shows earnings',
  ];
}
