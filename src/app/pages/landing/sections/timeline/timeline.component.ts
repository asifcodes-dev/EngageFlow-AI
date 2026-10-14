import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface TimelineStep {
  n: string;
  title: string;
  body: string; // may contain <b>…</b>
  why: string;
  green?: boolean;
}

/**
 * "A day with EngageFlow" — animated vertical timeline (marketing LP reference).
 * One customer walks through the four things EngageFlow does automatically. The
 * spine + node pulses are shared `.ef-timeline-spine` / `.ef-node-pulse(-g)`
 * utilities (gated behind prefers-reduced-motion in styles.css).
 */
@Component({
  selector: 'app-landing-timeline',
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="scroll-mt-20 border-t border-[#eef1f6] bg-[#fafbfd] ef-section dark:border-gray-800 dark:bg-white/[0.02]"
    >
      <div class="ef-container">
        <div class="ef-section-head">
          <span class="ef-eyebrow">A day with EngageFlow</span>
          <h2 class="ef-heading">Watch one comment become a sale</h2>
          <p class="ef-subheading">
            Follow a single customer through the four things EngageFlow does automatically — so you
            can see exactly what you're setting up.
          </p>
        </div>

        <div class="relative mx-auto mt-10 max-w-4xl sm:mt-12">
          <!-- animated spine (sm+) -->
          <div
            aria-hidden="true"
            class="ef-timeline-spine absolute top-11 bottom-32 left-6.75 hidden w-0.5 sm:block"
          ></div>

          <div class="flex flex-col gap-0">
            @for (s of steps; track s.n; let last = $last; let i = $index) {
              <div appReveal [style.--i]="i" class="relative flex items-start gap-5 py-4 sm:gap-7">
                <!-- per-row spine segment (mobile only; the continuous spine takes over at sm+) -->
                @if (!last) {
                  <span
                    aria-hidden="true"
                    class="ef-timeline-spine absolute top-11 -bottom-2.25 left-4.75 z-0 w-0.5 sm:hidden"
                  ></span>
                }
                <div
                  class="relative z-[1] grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-extrabold text-white sm:h-14 sm:w-14 sm:text-xl"
                  [class.ef-node-pulse]="!s.green"
                  [class.ef-node-pulse-g]="s.green"
                  [style.background]="
                    s.green
                      ? 'linear-gradient(135deg,#12b981,#0b8a5b)'
                      : 'linear-gradient(135deg,#2470c8,#16467f)'
                  "
                >
                  {{ s.n }}
                </div>
                <div
                  class="lift flex flex-1 flex-col items-start gap-4 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_6px_18px_-12px_rgba(20,40,80,0.28)] sm:flex-row sm:items-center sm:gap-5 sm:p-5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div class="flex-1">
                    <div class="text-base font-bold text-gray-900 sm:text-[17px] dark:text-white">
                      {{ s.title }}
                    </div>
                    <p
                      class="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                      [innerHTML]="s.body"
                    ></p>
                    <div
                      class="mt-2 text-xs font-semibold"
                      [style.color]="s.green ? '#0b8a5b' : '#1a5dab'"
                    >
                      {{ s.why }}
                    </div>
                  </div>
                  <div class="w-full shrink-0 sm:w-52">
                    <ng-container [ngSwitch]="s.n">
                      <div *ngSwitchCase="'01'" class="flex flex-col gap-1.5">
                        <div class="rounded-[10px] bg-[#f6f8fc] px-3 py-2 text-xs dark:bg-white/5">
                          Price kya hai? 😍
                        </div>
                        <div
                          class="rounded-[10px] px-3 py-2 text-xs text-white"
                          style="background:linear-gradient(135deg,#2470c8,#16467f)"
                        >
                          ₹499! DM check karo 📩
                        </div>
                      </div>
                      <div
                        *ngSwitchCase="'02'"
                        class="flex items-center gap-2.5 rounded-xl bg-[#fbebe8] p-3"
                      >
                        <span
                          class="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-[10px] bg-white"
                        >
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b3402f"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
                            <path d="M9 12h6" />
                          </svg>
                        </span>
                        <div>
                          <div class="text-[13px] font-bold text-gray-900">96 spam hidden</div>
                          <div class="text-[11px] text-gray-500">this week</div>
                        </div>
                      </div>
                      <div *ngSwitchCase="'03'" class="rounded-xl bg-[#f6f8fc] p-3 dark:bg-white/5">
                        <div class="text-xs font-bold text-gray-900 dark:text-white">
                          Get my free guide
                        </div>
                        <div
                          class="mt-2 flex h-6.5 items-center rounded-lg border border-[#e3e6eb] bg-white px-2.25 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                        >
                          Your name
                        </div>
                        <div
                          class="mt-1.5 flex h-6.5 items-center rounded-lg border border-[#e3e6eb] bg-white px-2.25 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                        >
                          Email address
                        </div>
                        <div
                          class="mt-2 flex h-6.5 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                          style="background:linear-gradient(135deg,#2470c8,#16467f)"
                        >
                          Send it to me →
                        </div>
                      </div>
                      <div
                        *ngSwitchCase="'04'"
                        class="rounded-xl p-4 text-white"
                        style="background:linear-gradient(150deg,#1a5dab,#16467f)"
                      >
                        <div class="text-[22px] font-extrabold">₹1,497</div>
                        <div class="text-[11px] text-white/70">earned overnight</div>
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TimelineComponent {
  readonly steps: TimelineStep[] = [
    {
      n: '01',
      title: 'A comment lands at 2am',
      body: 'A follower comments <b class="font-bold text-gray-700 dark:text-gray-200">“Price kya hai?”</b> at midnight — ready to buy, but you\'re asleep. EngageFlow <b class="font-bold text-gray-700 dark:text-gray-200">reads the comment, understands the intent, picks the right product, and replies with the price in their language</b> — within 3 seconds, publicly and in a DM.',
      why: "→ Why it matters: 9 of 10 buyers pick whoever answers first — now that's always you.",
    },
    {
      n: '02',
      title: 'Spam never makes it through',
      body: 'Scams, abuse and competitor spam are <b class="font-bold text-gray-700 dark:text-gray-200">detected and hidden automatically</b> — your launch stays clean and your brand stays safe, around the clock.',
      why: "→ Why it matters: real buyers aren't scared off by junk in your comments.",
    },
    {
      n: '03',
      title: 'Interest becomes a lead',
      body: 'An in-DM opt-in form <b class="font-bold text-gray-700 dark:text-gray-200">captures their name, email and goal</b> and drops it straight into your leads list — ready to nurture and re-market.',
      why: '→ Why it matters: you own the contact, not just a fleeting comment.',
    },
    {
      n: '04',
      title: 'You wake up to sales',
      body: 'Orders paid, leads captured, spam gone — <b class="font-bold text-gray-700 dark:text-gray-200">all before your first coffee.</b> Every rupee and reply is logged in your dashboard.',
      why: "→ Why it matters: growth keeps running even when you're offline.",
      green: true,
    },
  ];
}
