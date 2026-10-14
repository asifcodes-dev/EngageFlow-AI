import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

@Component({
  selector: 'app-landing-testimonials',
  imports: [RevealDirective],
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  readonly stars = [1, 2, 3, 4, 5];

  readonly testimonials: Testimonial[] = [
    {
      quote:
        'EngageFlow replies to my comments in Hindi before I even wake up. My DM sales nearly doubled in a month.',
      name: 'Priya Sharma',
      role: 'Boutique owner · @priyastyles',
      initials: 'PS',
    },
    {
      quote:
        'The spam protection alone is worth it — no more scam links under my posts, and zero effort from me.',
      name: 'Rahul Mehta',
      role: 'Fitness coach · @rahulfit',
      initials: 'RM',
    },
    {
      quote:
        'I set my product prices once and the AI quotes them perfectly every time. It saves me hours every day.',
      name: 'Aisha Khan',
      role: 'Skincare brand · @aishaglow',
      initials: 'AK',
    },
  ];
}
