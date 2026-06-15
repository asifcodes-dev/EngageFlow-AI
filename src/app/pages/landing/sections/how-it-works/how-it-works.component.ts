import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-how-it-works',
  templateUrl: './how-it-works.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  readonly steps: Step[] = [
    {
      number: '01',
      title: 'Pick a Trigger',
      description:
        'Choose what starts the conversation — a comment on a post, a story reply, or a keyword in a DM.',
    },
    {
      number: '02',
      title: 'Design the Flow',
      description:
        'Connect your product catalog, set the AI tone, and add lead forms or payment links — no code required.',
    },
    {
      number: '03',
      title: 'Launch Instantly',
      description:
        "Go live and let EngageFlow AI reply, qualify, and sell around the clock in your customer's language.",
    },
  ];
}
