import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrustedProfile {
  /** @handle shown under the avatar. */
  handle: string;
  /** Two-letter monogram inside the gradient ring avatar. */
  initials: string;
  /** "Niche · City" caption. */
  niche: string;
  /** Follower count, e.g. "18.4k". */
  followers: string;
  /** Post count, e.g. "312". */
  posts: string;
}

@Component({
  selector: 'app-landing-trusted',
  imports: [CommonModule],
  templateUrl: './trusted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedComponent {
  readonly profiles: TrustedProfile[] = [
    {
      handle: '@glowbypriya',
      initials: 'GP',
      niche: 'Beauty · Mumbai',
      followers: '18.4k',
      posts: '312',
    },
    {
      handle: '@studioarj',
      initials: 'SA',
      niche: 'Design · Jaipur',
      followers: '32.1k',
      posts: '540',
    },
    {
      handle: '@fitwithmeera',
      initials: 'FM',
      niche: 'Fitness · Delhi',
      followers: '54k',
      posts: '890',
    },
    {
      handle: '@bakery.mumbai',
      initials: 'BM',
      niche: 'Food · Mumbai',
      followers: '12.8k',
      posts: '205',
    },
    {
      handle: '@thelabelco',
      initials: 'TL',
      niche: 'Fashion · Surat',
      followers: '27.5k',
      posts: '412',
    },
  ];

  /**
   * One marquee "half" = the profiles repeated enough times to be wider than any
   * common viewport (~1920px). The track renders TWO of these halves and scrolls
   * -50%, so the second half slides into the first half's exact position with no
   * empty gap on wide screens — a truly never-ending loop.
   */
  readonly loop: TrustedProfile[] = [...this.profiles, ...this.profiles, ...this.profiles];
}
