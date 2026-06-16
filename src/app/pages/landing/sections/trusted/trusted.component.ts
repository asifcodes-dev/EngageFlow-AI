import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Profile {
  handle: string;
  name: string;
  initials: string;
  color: string;
  posts: string;
  followers: string;
  following: string;
  bio: string;
}

@Component({
  selector: 'app-landing-trusted',
  imports: [CommonModule],
  templateUrl: './trusted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedComponent {
  readonly profiles: Profile[] = [
    {
      handle: 'priya.styles',
      name: 'Priya • Boutique',
      initials: 'P',
      color: 'bg-brand-500',
      posts: '342',
      followers: '18.4K',
      following: '512',
      bio: 'Handpicked ethnic wear ✨ COD available · Ships pan-India 🇮🇳',
    },
    {
      handle: 'rahul.fit',
      name: 'Rahul Fitness',
      initials: 'R',
      color: 'bg-success-500',
      posts: '1,204',
      followers: '47.1K',
      following: '291',
      bio: 'Online coaching 💪 Fat-loss & strength · DM "PLAN"',
    },
    {
      handle: 'aisha.glow',
      name: 'Aisha Skincare',
      initials: 'A',
      color: 'bg-theme-pink-500',
      posts: '688',
      followers: '33.8K',
      following: '140',
      bio: 'Clean skincare 🌿 Dermat-approved · Tap to shop',
    },
    {
      handle: 'mumbai.kicks',
      name: 'Mumbai Kicks',
      initials: 'M',
      color: 'bg-orange-500',
      posts: '512',
      followers: '51.1K',
      following: '38',
      bio: 'Sneaker drops 🔥 100% authentic · Limited stock',
    },
    {
      handle: 'the.book.nook',
      name: 'The Book Nook',
      initials: 'B',
      color: 'bg-blue-light-500',
      posts: '929',
      followers: '11.5K',
      following: '203',
      bio: '📚 Indie reads & journals · Gift wrapping available',
    },
    {
      handle: 'desi.decor',
      name: 'Desi Decor',
      initials: 'D',
      color: 'bg-theme-purple-500',
      posts: '420',
      followers: '22.3K',
      following: '88',
      bio: 'Handmade home decor 🪔 Made in India · DM to order',
    },
  ];

  readonly highlights = [1, 2, 3, 4];
}
