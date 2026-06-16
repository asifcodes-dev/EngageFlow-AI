import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';

interface Stat {
  value: string;
  label: string;
  icon: string;
  color: string;
}

const I =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="';
const E = '" /></svg>';

@Component({
  selector: 'app-landing-stats',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  readonly stats: Stat[] = [
    {
      value: '10K+',
      label: 'Replies sent daily',
      icon:
        I +
        'M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5' +
        E,
      color:
        'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500',
    },
    {
      value: '12+',
      label: 'Languages spoken',
      icon:
        I +
        'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802' +
        E,
      color: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400',
    },
    {
      value: '<3s',
      label: 'Avg response time',
      icon: I + 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z' + E,
      color: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    },
    {
      value: '98%',
      label: 'Spam auto-caught',
      icon:
        I +
        'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' +
        E,
      color: 'bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400',
    },
  ];
}
