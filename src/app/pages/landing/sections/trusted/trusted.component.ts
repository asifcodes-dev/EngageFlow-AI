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
  /** Niche keywords (one per post slot) used to pull on-theme photos. */
  keywords: string[];
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
      keywords: ['saree', 'fashion', 'dress', 'jewellery', 'textile', 'boutique'],
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
      keywords: ['gym', 'fitness', 'workout', 'dumbbell', 'running', 'muscle'],
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
      keywords: ['skincare', 'cosmetics', 'spa', 'beauty', 'serum', 'makeup'],
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
      keywords: ['sneakers', 'shoes', 'streetwear', 'footwear', 'trainers', 'fashion'],
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
      keywords: ['books', 'bookstore', 'reading', 'library', 'journal', 'coffee'],
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
      keywords: ['decor', 'interior', 'candle', 'pottery', 'vase', 'plant'],
    },
  ];

  // Posts/highlights use real, niche-matched photos from LoremFlickr (keyword + a
  // `lock` param so they're deterministic). LoremFlickr can intermittently drop a
  // request, so each <img> falls back to picsum (a very reliable CDN) on error —
  // that guarantees a real photo always loads and the alt text never shows as
  // broken. Swap these helpers for the business's actual product shots later.
  readonly postSlots = [1, 2, 3, 4, 5, 6];
  readonly highlightSlots = [1, 2, 3, 4];

  postSrc(p: Profile, slot: number): string {
    return `https://loremflickr.com/300/300/${p.keywords[slot - 1]}?lock=${slot}`;
  }

  highlightSrc(p: Profile, slot: number): string {
    return `https://loremflickr.com/120/120/${p.keywords[slot - 1]}?lock=${slot + 20}`;
  }

  postFallback(p: Profile, slot: number): string {
    return `https://picsum.photos/seed/${p.handle}-p${slot}/300/300`;
  }

  highlightFallback(p: Profile, slot: number): string {
    return `https://picsum.photos/seed/${p.handle}-h${slot}/120/120`;
  }

  // Swap a broken image to its reliable fallback exactly once (no retry loop).
  onImgError(event: Event, fallback: string): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallbackApplied']) {
      return;
    }
    img.dataset['fallbackApplied'] = 'true';
    img.src = fallback;
  }
}
