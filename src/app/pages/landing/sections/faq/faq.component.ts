import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing-faq',
  templateUrl: './faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  readonly openIndex = signal<number | null>(0);

  readonly faqs: Faq[] = [
    {
      question: 'Do I need to know how to code?',
      answer:
        'No. EngageFlow AI is fully no-code. You set up products, triggers, and replies from a simple dashboard — no developers required.',
    },
    {
      question: 'Which languages does the AI support?',
      answer:
        "English, Hindi, Gujarati, Urdu, Marathi, Tamil, and mixed 'Hinglish' — the AI detects and replies in whatever language your customer uses.",
    },
    {
      question: 'Is this allowed by Instagram?',
      answer:
        "Yes. EngageFlow AI uses Meta's official Graph API and only performs actions that comply with Instagram's platform policies.",
    },
    {
      question: 'How does per-product pricing work?',
      answer:
        'You add your products and prices to your catalog. The AI matches each comment to the right product and injects the exact price into every reply automatically.',
    },
    {
      question: 'Can I sell digital products?',
      answer:
        'Yes, on the Business plan. Upload your file, connect a payment link, and buyers receive a secure, time-limited download automatically after payment.',
    },
    {
      question: 'Is there really a free plan?',
      answer:
        'Yes — the Free plan includes 1 Instagram account, 100 auto-replies per month, and 3 catalog items, with no credit card required.',
    },
  ];

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }

  isOpen(index: number): boolean {
    return this.openIndex() === index;
  }
}
