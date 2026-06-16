import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhoneFrameComponent } from '../../shared/phone-frame/phone-frame.component';

interface ModItem {
  handle: string;
  initials: string;
  color: string;
  comment: string;
  label: string;
  deleted: boolean;
}

@Component({
  selector: 'app-landing-moderation',
  imports: [CommonModule, RouterModule, PhoneFrameComponent],
  templateUrl: './moderation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModerationComponent {
  readonly points = [
    'Detects scams, MLM links & fake offers instantly',
    'Removes abuse & hate before customers ever see it',
    'Keeps genuine questions — only the junk gets deleted',
  ];

  readonly feed: ModItem[] = [
    {
      handle: 'arjun.d',
      initials: 'A',
      color: 'bg-brand-500',
      comment: 'Bhai price kya hai? 😍',
      label: 'Price inquiry',
      deleted: false,
    },
    {
      handle: 'sneaker_head',
      initials: 'S',
      color: 'bg-success-500',
      comment: 'These look 🔥🔥 just ordered!',
      label: 'Genuine engagement',
      deleted: false,
    },
    {
      handle: 'crypto_king99',
      initials: 'C',
      color: 'bg-gray-400',
      comment: 'Make $5000/day! Link in my bio 🚀💰',
      label: 'Spam · deleted',
      deleted: true,
    },
    {
      handle: 'troll_xyz',
      initials: 'T',
      color: 'bg-gray-400',
      comment: 'Worst brand ever, total scam 🤬',
      label: 'Abuse · deleted',
      deleted: true,
    },
    {
      handle: 'meera_k',
      initials: 'M',
      color: 'bg-theme-pink-500',
      comment: 'Kitne din me delivery hogi?',
      label: 'Price inquiry',
      deleted: false,
    },
    {
      handle: 'spam_bot_01',
      initials: 'B',
      color: 'bg-gray-400',
      comment: 'Free followers 👉 dm-me.link',
      label: 'Spam · deleted',
      deleted: true,
    },
  ];
}
