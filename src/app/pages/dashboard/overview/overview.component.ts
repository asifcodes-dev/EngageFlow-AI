import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StatCardComponent } from '../../../shared/components/common/stat-card/stat-card.component';
import { ConnectionStateService } from '../../../shared/services/connection-state.service';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { AuthService } from '../../../shared/services/auth.service';

interface ToolCard {
  name: string;
  desc: string;
  path: string;
  /** Which KPI total feeds the status pill (null = static text). */
  statusFrom: 'flows' | 'hidden' | 'contacts' | 'leads' | 'catalog' | null;
  /** Suffix/static text for the status pill. */
  statusText: string;
  /** Pill tone (au-pill-*-style tool pill; r7 per artboard). */
  statusTone: 'blue' | 'green';
}

/** Demo feed (reference artboard) — no activity endpoint exists yet. */
interface ActivityRow {
  dot: 'blue' | 'green' | 'grey';
  html: string;
  meta: string;
}

const ICON_DM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.4A8.4 8.4 0 1 1 21 11.5Z"/></svg>`;
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M20 6 9 17l-5-5"/></svg>`;
const ICON_CONTACTS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M17 8h5"/></svg>`;
const ICON_LEADS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.25 w-4.25"><path d="M12 2v20"/><path d="m19 9-7-7-7 7"/></svg>`;

@Component({
  selector: 'app-overview',
  imports: [CommonModule, RouterModule, StatCardComponent],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  private readonly connection = inject(ConnectionStateService);
  private readonly analytics = inject(AnalyticsService);
  private readonly auth = inject(AuthService);
  readonly connected$ = this.connection.connected$;
  readonly username$ = this.connection.username$;
  readonly user$ = this.auth.currentUser$;
  /** Plan/trial state for the banner; null if the call fails. */
  readonly usage$ = this.auth.usage().pipe(catchError(() => of(null)));
  /** Live KPI totals (0 until events accrue); resilient to a failed call. */
  readonly summary$ = this.analytics.getSummary('30d').pipe(catchError(() => of(null)));

  readonly icons = {
    dm: ICON_DM,
    comment: ICON_CHECK,
    contacts: ICON_CONTACTS,
    leads: ICON_LEADS,
  };

  /** Time-of-day greeting for the hero. */
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /** "Friday, 4 July" style date eyebrow (UTC-agnostic, local). */
  get todayLabel(): string {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  firstName(name: string | null | undefined): string {
    return name?.trim().split(/\s+/)[0] || 'there';
  }

  /** Status-pill text for a tool card, fed from live totals where they exist. */
  toolStatus(tool: ToolCard, t: Record<string, number> | undefined): string {
    if (!tool.statusFrom) return tool.statusText;
    const map: Record<string, number> = {
      flows: t?.['activeFlows'] ?? 0,
      hidden: (t?.['spamDeleted'] ?? 0) + (t?.['abuseDeleted'] ?? 0),
      contacts: t?.['contacts'] ?? 0,
      leads: t?.['leadsCaptured'] ?? 0,
      catalog: t?.['catalogSize'] ?? 0,
    };
    return `${map[tool.statusFrom]} ${tool.statusText}`;
  }

  /** Feature tiles (reference artboard order + copy). */
  readonly tools: ToolCard[] = [
    {
      name: 'Flows',
      desc: 'Auto-reply to comments & DMs from your triggers.',
      path: '/dashboard/flows',
      statusFrom: 'flows',
      statusText: 'active',
      statusTone: 'blue',
    },
    {
      name: 'Comment Guard',
      desc: 'Auto-hide spam & abusive comments with AI.',
      path: '/dashboard/comment-guard',
      statusFrom: 'hidden',
      statusText: 'hidden',
      statusTone: 'green',
    },
    {
      name: 'Reply Studio',
      desc: 'Train your AI voice and test replies live.',
      path: '/dashboard/reply-studio',
      statusFrom: null,
      statusText: 'AI voice',
      statusTone: 'blue',
    },
    {
      name: 'Audience',
      desc: 'Your contacts and conversation history.',
      path: '/dashboard/audience',
      statusFrom: 'contacts',
      statusText: 'contacts',
      statusTone: 'blue',
    },
    {
      name: 'Leads',
      desc: 'Capture leads from your automation flows.',
      path: '/dashboard/leads',
      statusFrom: 'leads',
      statusText: 'captured',
      statusTone: 'blue',
    },
    {
      name: 'Product Catalog',
      desc: 'Products & prices the AI quotes in replies.',
      path: '/dashboard/product-catalog',
      statusFrom: 'catalog',
      statusText: 'products',
      statusTone: 'blue',
    },
  ];

  /**
   * Recent-activity feed — REPRESENTATIVE DEMO ROWS from the design reference.
   * There is no activity endpoint yet; swap for real data when one ships.
   */
  readonly demoActivity: ActivityRow[] = [
    {
      dot: 'blue',
      html: 'Auto-replied in <b>Hindi</b> to <b>@priya.designs</b> with Reels Growth Guide pricing',
      meta: '2 minutes ago · Price reply flow',
    },
    {
      dot: 'green',
      html: 'Lead captured: <b>Ananya Iyer</b> — “Grow boutique sales”',
      meta: '18 minutes ago · Free guide flow',
    },
    {
      dot: 'grey',
      html: 'Spam comment hidden on Reel <b>“Summer sale”</b>',
      meta: '1 hour ago · Comment Guard',
    },
    {
      dot: 'green',
      html: 'Order paid: <b>Reels Growth Guide</b> · ₹499 by Priya Sharma',
      meta: '3 hours ago · Store',
    },
    {
      dot: 'blue',
      html: 'Story reply flow sent <b>42 DMs</b> after your poll story',
      meta: '6 hours ago · Story automation',
    },
  ];

  dotClass(dot: ActivityRow['dot']): string {
    return { blue: 'bg-[#1a5dab]', green: 'bg-[#2d7a4f]', grey: 'bg-[#6b7280]' }[dot];
  }
}
