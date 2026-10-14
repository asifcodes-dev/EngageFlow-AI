import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { ConnectionStateService } from '../../services/connection-state.service';
import { SidebarService } from '../../services/sidebar.service';
import { NAV_GROUPS, NavGroup } from '../nav';

/**
 * Aurora sidebar — a fixed 224px rail on desktop (below the top bar) that also
 * serves as the hamburger drawer below xl. Items are text-only with optional
 * right-aligned count badges (reference artboard); the Admin group is tinted
 * violet and shown to owners only. A trial upsell card pins to the bottom
 * while a trial is active, and Membership shows a "Trial" pill.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly connection = inject(ConnectionStateService);
  private readonly auth = inject(AuthService);
  private readonly analytics = inject(AnalyticsService);
  readonly sidebarService = inject(SidebarService);

  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;
  readonly connected$ = this.connection.connected$;
  readonly isAdmin$ = this.auth.currentUser$.pipe(map((u) => u?.role === 'ADMIN'));

  readonly groups: NavGroup[] = NAV_GROUPS;

  /** Trial state for the bottom upsell card (null = no active trial → hidden). */
  trial: { daysLeft: number; endsAt: Date } | null = null;

  /** Right-aligned count badges by route (reference: Leads / Product Catalog). */
  counts: Record<string, number> = {};

  ngOnInit(): void {
    // Show the upsell card + Membership "Trial" pill only while a trial runs.
    this.auth
      .usage()
      .pipe(
        map((u) =>
          u.isTrialing
            ? {
                daysLeft: u.trialDaysLeft,
                endsAt: new Date(Date.now() + u.trialDaysLeft * 86_400_000),
              }
            : null,
        ),
        catchError(() => of(null)),
        startWith(null),
      )
      .subscribe((t) => (this.trial = t));

    // Live counts for the badge slots (best-effort; omitted when unavailable).
    this.analytics
      .getSummary('30d')
      .pipe(catchError(() => of(null)))
      .subscribe((s) => {
        if (!s) return;
        this.counts = {
          '/dashboard/leads': s.totals.leadsCaptured,
          '/dashboard/product-catalog': s.totals.catalogSize,
        };
      });
  }

  isActive(path: string): boolean {
    const current = this.router.url.split('?')[0];
    if (path === '/dashboard') return current === '/dashboard';
    return current === path || current.startsWith(path + '/');
  }

  onLinkClick(): void {
    this.sidebarService.setMobileOpen(false);
  }
}
