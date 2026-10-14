import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  bg: string;
  icon: string;
}
interface ToolCard {
  title: string;
  desc: string;
  pill: string;
  pillClass: string;
}
interface Feat {
  title: string;
  desc: string;
  bg: string;
  icon: string;
}

/**
 * "Your dashboard" — a browser-framed preview of the Overview screen (marketing
 * LP reference). Purely presentational; scales down inside its own container so
 * the page body never scrolls sideways.
 */
@Component({
  selector: 'app-landing-dashboard-preview',
  imports: [CommonModule, SafeHtmlPipe, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="scroll-mt-20 ef-section">
      <div class="ef-container">
        <div class="ef-section-head">
          <span class="ef-eyebrow">Your dashboard</span>
          <h2 class="ef-heading">See everything in one place</h2>
          <p class="ef-subheading">
            Every reply, lead, sale and spam block is tracked live — so you always know what your
            automations earned you.
          </p>
        </div>

        <!-- Browser frame -->
        <div
          appReveal
          class="lift mx-auto mt-9 max-w-[960px] overflow-hidden rounded-2xl border border-gray-200 shadow-[0_30px_60px_-30px_rgba(20,40,80,0.5)] dark:border-gray-800"
        >
          <div
            class="flex h-10 items-center gap-1.5 border-b border-gray-200 bg-[#f2f4f7] px-3.5 dark:border-gray-800 dark:bg-white/5"
          >
            <span class="h-2.75 w-2.75 rounded-full bg-[#f45b52]"></span>
            <span class="h-2.75 w-2.75 rounded-full bg-[#f7bf4d]"></span>
            <span class="h-2.75 w-2.75 rounded-full bg-[#33c15c]"></span>
            <span
              class="mx-auto rounded-md bg-white px-8 py-1 text-[11px] text-gray-400 sm:px-16 dark:bg-gray-800"
            >
              app.engageflow.ai/overview
            </span>
          </div>

          <div class="flex bg-[#f6f7f9] text-left sm:h-[440px] dark:bg-gray-950">
            <!-- Sidebar (sm+) -->
            <div
              class="hidden w-[172px] shrink-0 flex-col gap-0.5 border-r border-[#eef1f6] bg-white px-2.5 py-3 sm:flex dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                class="px-2.5 pt-0.5 pb-1 text-[8px] font-bold tracking-[0.12em] text-[#9aa1ab] uppercase"
              >
                Main
              </div>
              <div
                class="flex h-6.5 items-center gap-1.75 rounded-lg px-2.5 text-[10.5px] font-bold text-[#1a5dab]"
                style="background:linear-gradient(120deg,#e8f0fb,#dcebfb)"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a5dab"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                Overview
              </div>
              <div
                class="px-2.5 pt-2 pb-1 text-[8px] font-bold tracking-[0.12em] text-[#9aa1ab] uppercase"
              >
                Engage
              </div>
              @for (row of engageRows; track row) {
                <div
                  class="flex h-6.5 items-center justify-between rounded-lg px-2.5 text-[10.5px] text-gray-500"
                >
                  <span class="flex items-center gap-1.75" [innerHTML]="row.icon | safeHtml"></span>
                  @if (row.count) {
                    <span class="text-[9px] font-bold text-[#8894a8]">{{ row.count }}</span>
                  }
                </div>
              }
              <div
                class="px-2.5 pt-2 pb-1 text-[8px] font-bold tracking-[0.12em] text-[#9aa1ab] uppercase"
              >
                Sell
              </div>
              @for (row of sellRows; track row) {
                <div
                  class="flex h-6.5 items-center justify-between rounded-lg px-2.5 text-[10.5px] text-gray-500"
                >
                  <span class="flex items-center gap-1.75" [innerHTML]="row.icon | safeHtml"></span>
                  @if (row.count) {
                    <span class="text-[9px] font-bold text-[#8894a8]">{{ row.count }}</span>
                  }
                </div>
              }
              <div
                class="mt-auto rounded-[10px] p-2.5 text-white"
                style="background:linear-gradient(135deg,#1a5dab,#16467f)"
              >
                <div class="text-[9.5px] font-bold">Pro trial — 5 days left</div>
                <div class="mt-1.5 text-[9.5px] font-semibold text-[#cfe0f6]">Upgrade →</div>
              </div>
            </div>

            <!-- Main -->
            <div class="flex min-w-0 flex-1 flex-col gap-2.5 overflow-hidden p-3.5 sm:p-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-[8px] font-bold tracking-[0.1em] text-[#8894a8] uppercase">
                    Home / Overview
                  </div>
                  <div
                    class="mt-0.5 text-base font-extrabold tracking-tight text-gray-900 dark:text-white"
                  >
                    Overview
                  </div>
                </div>
                <span
                  class="rounded-lg px-3 py-1.75 text-[10px] font-bold text-white"
                  style="background:linear-gradient(135deg,#2470c8,#16467f)"
                  >Create a flow →</span
                >
              </div>

              <!-- Hero card -->
              <div
                class="overflow-hidden rounded-xl px-4 py-3.25 text-white"
                style="background:linear-gradient(120deg,#2470c8,#16467f)"
              >
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <div class="text-[8px] font-bold tracking-[0.12em] text-white/75 uppercase">
                      Friday, 4 July
                    </div>
                    <div class="mt-0.75 text-[15px] font-extrabold">Good morning, Mark</div>
                    <div class="mt-0.5 text-[10.5px] text-white/[.82]">
                      Your automations handled 214 interactions overnight.
                    </div>
                  </div>
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1.25 text-[9.5px] font-semibold whitespace-nowrap"
                  >
                    <span class="au-ring-dot h-1.5 w-1.5 rounded-full bg-[#7fd1a2]"></span
                    >&#64;mark.creates · Connected
                  </span>
                </div>
                <div class="mt-2.75 flex gap-5.5">
                  <div>
                    <div class="text-sm font-extrabold">214</div>
                    <div class="text-[8px] tracking-[0.05em] text-white/70 uppercase">
                      Overnight replies
                    </div>
                  </div>
                  <div class="border-l border-white/20 pl-5.5">
                    <div class="text-sm font-extrabold">+38</div>
                    <div class="text-[8px] tracking-[0.05em] text-white/70 uppercase">
                      New followers
                    </div>
                  </div>
                  <div class="border-l border-white/20 pl-5.5">
                    <div class="text-sm font-extrabold">₹1,497</div>
                    <div class="text-[8px] tracking-[0.05em] text-white/70 uppercase">
                      Revenue today
                    </div>
                  </div>
                </div>
              </div>

              <!-- KPI row -->
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                @for (k of kpis; track k.label) {
                  <div
                    class="rounded-[10px] border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div class="flex items-center justify-between">
                      <span
                        class="text-[7.5px] font-bold tracking-[0.06em] text-[#8894a8] uppercase"
                        >{{ k.label }}</span
                      >
                      <span
                        class="grid h-5 w-5 place-items-center rounded-[7px]"
                        [style.background]="k.bg"
                        [innerHTML]="k.icon | safeHtml"
                      ></span>
                    </div>
                    <div class="mt-1.25 flex items-baseline gap-1.25">
                      <span class="text-[15px] font-extrabold text-gray-900 dark:text-white">{{
                        k.value
                      }}</span>
                      <span
                        class="rounded-full bg-[#e8f8ef] px-1.25 py-px text-[8px] font-bold text-[#2d7a4f]"
                        >{{ k.delta }}</span
                      >
                    </div>
                  </div>
                }
              </div>

              <!-- Tools + activity -->
              <div class="flex min-h-0 flex-1 flex-col gap-2 lg:flex-row">
                <div class="grid flex-[1.4] grid-cols-2 content-start gap-2">
                  @for (t of tools; track t.title) {
                    <div
                      class="rounded-[10px] border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div class="text-[11px] font-bold text-gray-900 dark:text-white">
                        {{ t.title }}
                      </div>
                      <div class="mt-0.5 text-[9px] text-[#8894a8]">{{ t.desc }}</div>
                      <div class="mt-1.75 flex items-center justify-between">
                        <span
                          class="rounded-md px-1.75 py-0.5 text-[8px] font-bold"
                          [ngClass]="t.pillClass"
                          >{{ t.pill }}</span
                        >
                        <span class="text-[9px] font-bold text-[#1a5dab]">Open →</span>
                      </div>
                    </div>
                  }
                </div>
                <div
                  class="flex flex-1 flex-col rounded-[10px] border border-gray-100 bg-white p-2.75 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-gray-900 dark:text-white"
                      >Recent activity</span
                    >
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-[#e8f8ef] px-1.75 py-0.5 text-[8px] font-semibold text-[#2d7a4f]"
                    >
                      <span class="au-ring-dot h-1.25 w-1.25 rounded-full bg-[#2d7a4f]"></span>Live
                    </span>
                  </div>
                  @for (a of activity; track a.text; let last = $last) {
                    <div
                      class="flex gap-1.75 py-1.75"
                      [class.border-b]="!last"
                      [class.border-gray-100]="!last"
                      [class.dark:border-gray-800]="!last"
                    >
                      <span
                        class="mt-0.75 h-1.5 w-1.5 shrink-0 rounded-full"
                        [style.background]="a.dot"
                      ></span>
                      <div
                        class="text-[9.5px] leading-snug text-gray-700 dark:text-gray-300"
                        [innerHTML]="a.text"
                      ></div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature row -->
        <div
          class="mx-auto mt-[22px] grid max-w-[960px] grid-cols-1 gap-4 text-left sm:grid-cols-3"
        >
          @for (f of feats; track f.title; let i = $index) {
            <div appReveal [style.--i]="i" class="flex items-start gap-3">
              <span
                class="grid h-8 w-8 shrink-0 place-items-center rounded-[10px]"
                [style.background]="f.bg"
                [innerHTML]="f.icon | safeHtml"
              ></span>
              <div>
                <div class="text-[13.5px] font-bold text-gray-900 dark:text-white">
                  {{ f.title }}
                </div>
                <div class="text-[12.5px] leading-normal text-gray-500 dark:text-gray-400">
                  {{ f.desc }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class DashboardPreviewComponent {
  private mi(stroke: string, path: string): string {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }
  private ki(stroke: string, path: string, strokeWidth = '2'): string {
    return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }
  private fi(stroke: string, path: string): string {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  readonly engageRows = [
    {
      icon: this.mi('#9aa1ab', '<path d="M4 7h16M4 12h10M4 17h13" />') + '<span>Flows</span>',
      count: '',
    },
    {
      icon:
        this.mi('#9aa1ab', '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />') +
        '<span>Comment Guard</span>',
      count: '',
    },
    {
      icon:
        this.mi(
          '#9aa1ab',
          '<path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />',
        ) + '<span>Leads</span>',
      count: '312',
    },
  ];

  readonly sellRows = [
    {
      icon:
        this.mi(
          '#9aa1ab',
          '<circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 8H6" />',
        ) + '<span>Sales</span>',
      count: '6',
    },
    {
      icon:
        this.mi(
          '#9aa1ab',
          '<rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />',
        ) + '<span>Earnings</span>',
      count: '',
    },
  ];

  readonly kpis: Kpi[] = [
    {
      label: 'DM replies',
      value: '1,284',
      delta: '+12%',
      bg: 'linear-gradient(135deg,#e8f0fb,#d6e6fa)',
      icon: this.ki(
        '#1a5dab',
        '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.4A8.4 8.4 0 1 1 21 11.5Z" />',
      ),
    },
    {
      label: 'Comments',
      value: '3,408',
      delta: '+9%',
      bg: 'linear-gradient(135deg,#e8f8ef,#d5f2e2)',
      icon: this.ki('#2d7a4f', '<path d="M20 6 9 17l-5-5" />', '2.4'),
    },
    {
      label: 'Contacts',
      value: '862',
      delta: '+64',
      bg: 'linear-gradient(135deg,#f0ecfb,#e5dcf7)',
      icon: this.ki(
        '#5b4a9e',
        '<circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M17 8h5" />',
      ),
    },
    {
      label: 'Leads',
      value: '312',
      delta: '+18%',
      bg: 'linear-gradient(135deg,#fbf0e8,#f7e4d5)',
      icon: this.ki('#a05a2c', '<path d="M12 2v20M19 9l-7-7-7 7" />'),
    },
  ];

  readonly tools: ToolCard[] = [
    {
      title: 'Flows',
      desc: 'Auto-reply to comments & DMs',
      pill: '8 active',
      pillClass: 'bg-[#e8f0fb] text-[#1a5dab]',
    },
    {
      title: 'Comment Guard',
      desc: 'Auto-hide spam with AI',
      pill: '96 hidden',
      pillClass: 'bg-[#e8f8ef] text-[#2d7a4f]',
    },
    {
      title: 'Leads',
      desc: 'Capture leads from flows',
      pill: '312 captured',
      pillClass: 'bg-[#e8f0fb] text-[#1a5dab]',
    },
    {
      title: 'Product Catalog',
      desc: 'Prices the AI quotes',
      pill: '12 products',
      pillClass: 'bg-[#e8f0fb] text-[#1a5dab]',
    },
  ];

  readonly activity = [
    {
      dot: '#1a5dab',
      text: 'Auto-replied in <b class="font-bold text-gray-900 dark:text-white">Hindi</b> to <b class="font-bold text-gray-900 dark:text-white">@priya.designs</b><div class="mt-px text-[8px] text-gray-400">2 min ago</div>',
    },
    {
      dot: '#2d7a4f',
      text: 'Lead captured: <b class="font-bold text-gray-900 dark:text-white">Ananya Iyer</b><div class="mt-px text-[8px] text-gray-400">18 min ago</div>',
    },
    {
      dot: '#2d7a4f',
      text: 'Order paid: <b class="font-bold text-gray-900 dark:text-white">₹499</b> · Reels Guide<div class="mt-px text-[8px] text-gray-400">3 hrs ago</div>',
    },
  ];

  readonly feats: Feat[] = [
    {
      title: 'Live KPIs',
      desc: 'Replies, comments, leads & revenue update in real time.',
      bg: 'linear-gradient(135deg,#e8f0fb,#d6e6fa)',
      icon: this.fi('#1a5dab', '<path d="M3 3v18h18" /><path d="m7 14 3-3 3 3 5-5" />'),
    },
    {
      title: 'Engagement trends',
      desc: 'See which days and posts drive the most action.',
      bg: 'linear-gradient(135deg,#e8f8ef,#d5f2e2)',
      icon: this.fi('#2d7a4f', '<path d="M3 12h4l3 8 4-16 3 8h4" />'),
    },
    {
      title: 'Earnings & payouts',
      desc: 'Track sales, platform fees and weekly payouts in one view.',
      bg: 'linear-gradient(135deg,#f0ecfb,#e5dcf7)',
      icon: this.fi(
        '#5b4a9e',
        '<rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />',
      ),
    },
  ];
}
