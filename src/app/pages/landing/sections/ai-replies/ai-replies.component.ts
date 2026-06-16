import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhoneFrameComponent } from '../../shared/phone-frame/phone-frame.component';

interface FeedItem {
  handle: string;
  initials: string;
  color: string;
  comment: string;
  reply: string;
}

@Component({
  selector: 'app-landing-ai-replies',
  imports: [CommonModule, RouterModule, PhoneFrameComponent],
  templateUrl: './ai-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiRepliesComponent {
  readonly languages = ['Hindi', 'Urdu', 'Gujarati', 'English', 'Tamil', 'Marathi'];

  readonly feed: FeedItem[] = [
    {
      handle: 'rahul_mumbai',
      initials: 'R',
      color: 'bg-orange-500',
      comment: 'Bhai yeh kitne ka hai? 🔥',
      reply: 'Namaste! 🙏 Yeh sirf ₹2,499 ka hai. Order ke liye DM karein 📩',
    },
    {
      handle: 'priya_ahd',
      initials: 'P',
      color: 'bg-theme-pink-500',
      comment: 'આ કેટલાનું છે?',
      reply: 'નમસ્તે! 😊 આ ₹1,799 નું છે. ઓર્ડર માટે DM કરો!',
    },
    {
      handle: 'sana.k',
      initials: 'S',
      color: 'bg-brand-500',
      comment: 'قیمت کیا ہے؟',
      reply: 'السلام علیکم! یہ ₹999 کا ہے۔ مزید کے لیے DM کریں 📩',
    },
    {
      handle: 'arjun_d',
      initials: 'A',
      color: 'bg-success-500',
      comment: 'Do you ship to Delhi?',
      reply: 'Yes! 🚚 We ship pan-India in 3–5 days. Want me to share the link?',
    },
    {
      handle: 'neha.styles',
      initials: 'N',
      color: 'bg-blue-light-500',
      comment: 'Ek size chhota hai kya?',
      reply: 'Haan ji! 👍 S/M/L sab available hai. Aapka size bataiye 😊',
    },
    {
      handle: 'kabir__',
      initials: 'K',
      color: 'bg-theme-purple-500',
      comment: 'भाव क्या है इसका?',
      reply: 'नमस्ते! 🙏 इसकी कीमत ₹1,299 है। COD के लिए DM करें!',
    },
  ];
}
