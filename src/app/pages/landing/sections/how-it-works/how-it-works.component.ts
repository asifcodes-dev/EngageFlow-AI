import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string; // inline SVG for the accent chip
  bar: string; // top gradient bar
  chip: string; // number chip gradient
  chipShadow: string;
  iconBg: string; // accent icon chip bg
  arrow: string; // arrow stroke color (drawn after the card)
}

const ICON =
  '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';

@Component({
  selector: 'app-landing-how-it-works',
  imports: [CommonModule, SafeHtmlPipe, RevealDirective],
  templateUrl: './how-it-works.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  readonly steps: Step[] = [
    {
      number: '01',
      title: 'Pick a trigger',
      description: 'Choose a comment keyword, story reply, or DM to kick things off.',
      icon: ICON.replace('STROKE', '#1a5dab') + '<path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>',
      bar: 'linear-gradient(120deg,#2470c8,#5aa0e8,#2470c8)',
      chip: 'linear-gradient(135deg,#2470c8,#16467f)',
      chipShadow: '0 12px 24px -10px rgba(26,93,171,.65)',
      iconBg: 'linear-gradient(135deg,#e8f0fb,#d6e6fa)',
      arrow: '#2470c8',
    },
    {
      number: '02',
      title: 'Design the flow',
      description: 'Map the reply, DM, lead form and product — visually, no code.',
      icon:
        ICON.replace('STROKE', '#5b4a9e') +
        '<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5" /></svg>',
      bar: 'linear-gradient(120deg,#7c5cf0,#a78bfa,#7c5cf0)',
      chip: 'linear-gradient(135deg,#7c5cf0,#5b3bd0)',
      chipShadow: '0 12px 24px -10px rgba(124,92,240,.65)',
      iconBg: 'linear-gradient(135deg,#f0ecfb,#e5dcf7)',
      arrow: '#7c5cf0',
    },
    {
      number: '03',
      title: 'Launch instantly',
      description: 'Go live and watch replies, leads and sales roll in 24/7.',
      icon:
        ICON.replace('STROKE', '#0b8a5b') +
        '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>',
      bar: 'linear-gradient(120deg,#12b981,#5fd6a8,#12b981)',
      chip: 'linear-gradient(135deg,#12b981,#0b8a5b)',
      chipShadow: '0 12px 24px -10px rgba(11,138,91,.6)',
      iconBg: 'linear-gradient(135deg,#e8f8ef,#d5f2e2)',
      arrow: '#12b981',
    },
  ];
}
