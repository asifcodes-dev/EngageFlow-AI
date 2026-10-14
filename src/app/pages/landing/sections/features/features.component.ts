import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

type FeatureId = 'comment' | 'moderation' | 'dm' | 'lead' | 'story' | 'live' | 'sell' | 'analytics';

interface Feature {
  id: FeatureId;
  /** Mini-mockup header background (exact gradient / hex from the reference). */
  headerBg: string;
  tag: string;
  tagBg: string;
  tagFg: string;
  title: string;
  desc: string;
  action: string;
}

@Component({
  selector: 'app-landing-features',
  imports: [CommonModule, RouterModule, RevealDirective],
  templateUrl: './features.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent {
  readonly features: Feature[] = [
    {
      id: 'comment',
      headerBg: 'linear-gradient(160deg,#eef2fb,#dde8f8)',
      tag: 'Engagement',
      tagBg: '#e8f0fb',
      tagFg: '#1a5dab',
      title: 'Comment Automation',
      desc: 'Auto-reply to comments and send instant DMs to turn followers into customers.',
      action: 'Automate comments',
    },
    {
      id: 'moderation',
      headerBg: 'linear-gradient(160deg,#eaf7f0,#d6f0e2)',
      tag: 'Automation',
      tagBg: '#e8f8ef',
      tagFg: '#2d7a4f',
      title: 'AI Comment Moderation',
      desc: 'AI-powered moderation removes spam and abuse, keeping your section clean 24/7.',
      action: 'Enable moderation',
    },
    {
      id: 'dm',
      headerBg: 'linear-gradient(160deg,#fbf4ec,#f6e6d4)',
      tag: 'Sales Funnel',
      tagBg: '#fbf3e6',
      tagFg: '#a07a2c',
      title: 'DM Automation',
      desc: 'Scale sales by automatically qualifying leads and replying to direct messages.',
      action: 'Automate DMs',
    },
    {
      id: 'lead',
      headerBg: 'linear-gradient(150deg,#a78bfa,#7c5cf0)',
      tag: 'Lead Gen',
      tagBg: '#f0ecfb',
      tagFg: '#5b4a9e',
      title: 'Lead Magnets',
      desc: 'Capture emails and distribute digital products through high-converting opt-in forms.',
      action: 'Launch magnet',
    },
    {
      id: 'story',
      headerBg: 'linear-gradient(160deg,#ede9fb,#ddd4f7)',
      tag: 'Interaction',
      tagBg: '#f0ecfb',
      tagFg: '#5b4a9e',
      title: 'Story Automation',
      desc: 'Instantly respond to story mentions and reactions to keep your brand active 24/7.',
      action: 'Setup story bot',
    },
    {
      id: 'live',
      headerBg: '#10131a',
      tag: 'Real-time',
      tagBg: '#fdebef',
      tagFg: '#d12b52',
      title: 'Live Automation',
      desc: 'Send automated messages to your most active viewers during Instagram Live sessions.',
      action: 'Go live pro',
    },
    {
      id: 'sell',
      headerBg: 'linear-gradient(160deg,#eaf7f0,#d6f0e2)',
      tag: 'Monetize',
      tagBg: '#e8f8ef',
      tagFg: '#2d7a4f',
      title: 'Sell Digital Products',
      desc: 'Sell ebooks, templates & courses in DMs with Razorpay links and instant delivery.',
      action: 'Start selling',
    },
    {
      id: 'analytics',
      headerBg: 'linear-gradient(160deg,#eef4fc,#dce9fa)',
      tag: 'Insights',
      tagBg: '#e8f0fb',
      tagFg: '#1a5dab',
      title: 'Analytics & Insights',
      desc: 'See replies, leads, spam removed and revenue — proof of ROI at a glance.',
      action: 'View analytics',
    },
  ];
}
