import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Feature {
  title: string;
  sub: string;
}

@Component({
  selector: 'app-landing-ai-replies',
  imports: [CommonModule, RouterModule, RevealDirective],
  templateUrl: './ai-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiRepliesComponent {
  readonly features: Feature[] = [
    {
      title: 'Context-aware & multilingual',
      sub: 'Replies in Hindi, English, Gujarati, Urdu & more.',
    },
    {
      title: 'Quotes your real prices',
      sub: 'Pulls from your product catalog automatically.',
    },
    {
      title: 'Captures the lead',
      sub: 'Turns interest into a contact in your CRM.',
    },
  ];
}
