import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  kind: 'comment' | 'moderation' | 'story' | 'live' | 'dm' | 'follow' | 'lead' | 'ai';
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  action: string;
}

@Component({
  selector: 'app-landing-features',
  imports: [CommonModule, RouterModule],
  templateUrl: './features.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent {
  readonly features: Feature[] = [
    {
      kind: 'comment',
      tag: 'Engagement',
      tagColor: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
      title: 'Comment Automation',
      desc: 'Auto-reply to comments and send instant DMs that turn followers into customers.',
      action: 'Automate comments',
    },
    {
      kind: 'moderation',
      tag: 'Automation',
      tagColor: 'bg-theme-purple-500/10 text-theme-purple-500',
      title: 'AI Comment Moderation',
      desc: 'AI removes spam, scams, and abuse 24/7 — keeping your comment section clean.',
      action: 'Enable moderation',
    },
    {
      kind: 'story',
      tag: 'Interaction',
      tagColor:
        'bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-500',
      title: 'Story Automation',
      desc: 'Instantly respond to story replies and reactions to keep your brand active 24/7.',
      action: 'Set up story bot',
    },
    {
      kind: 'live',
      tag: 'Real-time',
      tagColor: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
      title: 'Live Automation',
      desc: 'Send automated messages to your most active viewers during Instagram Live.',
      action: 'Go live pro',
    },
    {
      kind: 'dm',
      tag: 'Sales funnel',
      tagColor: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
      title: 'DM Automation',
      desc: 'Scale sales by automatically qualifying leads and replying to direct messages.',
      action: 'Build a funnel',
    },
    {
      kind: 'follow',
      tag: 'Growth',
      tagColor: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
      title: 'Follow Gate',
      desc: 'Grow your audience by requiring a follow before sending exclusive links.',
      action: 'Grow followers',
    },
    {
      kind: 'lead',
      tag: 'Lead gen',
      tagColor: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
      title: 'Lead Magnets',
      desc: 'Capture emails and deliver digital products through high-converting opt-in forms.',
      action: 'Launch a magnet',
    },
    {
      kind: 'ai',
      tag: 'AI',
      tagColor: 'bg-theme-purple-500/10 text-theme-purple-500',
      title: 'AI Comment Replies',
      desc: 'AI understands any language — Hindi, Urdu, Gujarati, English — and replies instantly.',
      action: 'Enable AI replies',
    },
  ];
}
