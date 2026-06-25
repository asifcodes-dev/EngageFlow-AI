import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { SafeHtmlPipe } from '../../../shared/pipe/safe-html.pipe';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';

interface ToolCard {
  name: string;
  desc: string;
  path: string;
  icon: string;
}

const ICON_DM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/></svg>`;
const ICON_COMMENT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h6m8 0a8 8 0 0 1-11.8 7L3 20l1-4.2A8 8 0 1 1 21 12Z"/></svg>`;
const ICON_CONTACTS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 8v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>`;
const ICON_LEADS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 0a2 2 0 1 1 6 0M9 14l2 2 4-4"/></svg>`;

@Component({
  selector: 'app-overview',
  imports: [CommonModule, RouterModule, PageBreadcrumbComponent, StatCardComponent, SafeHtmlPipe],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  private readonly connection = inject(ConnectionStateService);
  readonly connected$ = this.connection.connected$;

  readonly icons = {
    dm: ICON_DM,
    comment: ICON_COMMENT,
    contacts: ICON_CONTACTS,
    leads: ICON_LEADS,
  };

  /** Feature tiles that need a connected Instagram account to use. */
  readonly tools: ToolCard[] = [
    {
      name: 'Flows',
      desc: 'Auto-reply to comments & DMs from your triggers.',
      path: '/dashboard/flows',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 7h6M5 12h14M5 17h9M17 5l3 3-3 3"/></svg>`,
    },
    {
      name: 'Comment Guard',
      desc: 'Auto-hide spam & abusive comments with AI.',
      path: '/dashboard/comment-guard',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6l-8-3Zm-2 9 1.5 1.5L15 10"/></svg>`,
    },
    {
      name: 'Reply Studio',
      desc: 'Train your AI voice and test replies.',
      path: '/dashboard/reply-studio',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3a9 9 0 1 0 4.5 16.8L21 21l-1.2-4.5A9 9 0 0 0 12 3Zm-3 9h.01M12 12h.01M15 12h.01"/></svg>`,
    },
    {
      name: 'Audience',
      desc: 'Your contacts and conversation history.',
      path: '/dashboard/audience',
      icon: ICON_CONTACTS,
    },
    {
      name: 'Leads',
      desc: 'Capture leads from your automation flows.',
      path: '/dashboard/leads',
      icon: ICON_LEADS,
    },
  ];
}
